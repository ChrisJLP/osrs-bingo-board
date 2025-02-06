// frontend/src/features/board/components/WikiSearch.jsx
import React, { useState, useEffect } from "react";

const WikiSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const category = "Category:Items"; // using one category for simplicity
        const res = await fetch(
          `https://oldschool.runescape.wiki/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
            category
          )}&cmlimit=500&format=json&origin=*`,
          {
            headers: {
              "User-Agent": "OSRS Bingo App (your_email@example.com)",
            },
          }
        );
        const data = await res.json();
        if (data.query && data.query.categorymembers) {
          const items = data.query.categorymembers.map((item) => item.title);
          setEntries([...new Set(items)]);
        }
      } catch (error) {
        console.error("Error fetching OSRS Wiki entries:", error);
      }
    };
    fetchEntries();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value) {
      setFilteredResults([]);
      return;
    }
    const filtered = entries.filter(
      (entry) =>
        entry.toLowerCase().includes(value.toLowerCase()) &&
        !entry.startsWith("Category:")
    );
    setFilteredResults(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search OSRS Wiki..."
        value={query}
        onChange={handleInputChange}
      />
      {filteredResults.length > 0 && (
        <ul>
          {filteredResults.map((entry) => (
            <li
              key={entry}
              onClick={() => {
                onSelect(entry);
                setQuery("");
                setFilteredResults([]);
              }}
            >
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WikiSearch;
