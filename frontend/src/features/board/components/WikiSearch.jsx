import React, { useState, useEffect } from "react";

const WikiSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
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
    <div>
      <input
        type="text"
        placeholder="Search OSRS Wiki..."
        value={query}
        onChange={handleInputChange}
        className="border border-[#8b6d48] rounded-lg p-1 mb-2 w-full text-[#3b2f25]"
      />
      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((result) => (
            <li
              key={result.pageid}
              onClick={() => handleSelect(result)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              {result.thumbnail && (
                <img
                  src={result.thumbnail.source}
                  alt={result.title}
                  style={{ width: "20px", height: "20px" }}
                />
              )}
              <span className="text-[#3b2f25]">{result.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WikiSearch;
