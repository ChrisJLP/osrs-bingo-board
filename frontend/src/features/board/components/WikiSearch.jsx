import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const WikiSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://oldschool.runescape.wiki/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
            query
          )}&prop=pageimages&pithumbsize=100&format=json&origin=*`
        );
        const data = await res.json();
        if (data.query && data.query.pages) {
          const pages = Object.values(data.query.pages);
          const sorted = pages.sort((a, b) => a.index - b.index);
          setResults(sorted);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching OSRS Wiki search results:", error);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500); // debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (result) => {
    onSelect({
      title: result.title,
      imageUrl: result.thumbnail ? result.thumbnail.source : "",
    });
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search OSRS Wiki..."
        value={query}
        onChange={handleInputChange}
        className="border border-[#8B5A2B] rounded-lg p-1 w-full text-[#362511]"
      />
      {loading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="w-4 h-4" />
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute bg-white border border-[#8B5A2B] rounded mt-1 w-full z-10">
          {results.map((result) => (
            <li
              key={result.pageid}
              onClick={() => handleSelect(result)}
              className="flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-100"
            >
              {result.thumbnail && (
                <img
                  src={result.thumbnail.source}
                  alt={result.title}
                  className="w-5 h-5"
                />
              )}
              <span className="text-[#362511]">{result.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WikiSearch;
