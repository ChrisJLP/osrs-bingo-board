import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const TileEditor = ({ onSelectEntry, onCancel }) => {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const modalRef = useRef(null);

  // Fetch entries once on mount using Promise.all for batching.
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const categories = [
          "Category:Bosses",
          "Category:Minigames",
          "Category:Collection log items",
          "Category:Revenant drop table",
          "Category:Items dropped by monsters",
          "Category:Members' items",
          "Category:Tradeable items",
          "Category:Wilderness",
          "Category:Items that cannot be alchemised",
          "Category:Crystal Items",
          "Category:Boss drops",
          "Category:Grand Exchange items",
          "Category:Items", // optionally very broad
        ];

        // Create an array of fetch promises.
        const fetchPromises = categories.map((category) =>
          fetch(
            `https://oldschool.runescape.wiki/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
              category
            )}&cmlimit=500&format=json&origin=*`,
            {
              headers: {
                "User-Agent": "OSRS Bingo App (your_email@example.com)",
              },
            }
          ).then((res) => res.json())
        );

        // Run all requests concurrently.
        const results = await Promise.all(fetchPromises);

        // Extract items from each category.
        let allEntries = [];
        results.forEach((data) => {
          if (data.query && data.query.categorymembers) {
            const items = data.query.categorymembers.map((item) => item.title);
            allEntries = [...allEntries, ...items];
          }
        });

        // Remove duplicates.
        setEntries([...new Set(allEntries)]);
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
    // Filter entries and exclude any that start with "Category:"
    const filtered = entries.filter(
      (entry) =>
        entry.toLowerCase().includes(value.toLowerCase()) &&
        !entry.startsWith("Category:")
    );
    setFilteredResults(filtered);
  };

  // Close if click outside the modal.
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel && onCancel();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with onClick to cancel */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          onCancel && onCancel();
        }}
      />
      {/* Popup */}
      <div
        ref={modalRef}
        className="relative bg-white p-4 rounded shadow-lg w-80"
      >
        <input
          data-testid="tile-editor-input"
          type="text"
          placeholder="Search OSRS Wiki..."
          value={query}
          onChange={handleInputChange}
          className="border rounded p-2 w-full mb-2"
        />
        {filteredResults.length > 0 && (
          <ul className="bg-white border rounded w-full mt-1 shadow-md max-h-48 overflow-y-auto">
            {filteredResults.map((entry) => (
              <li
                key={entry}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEntry(entry);
                  // Clear search and results after selection.
                  setQuery("");
                  setFilteredResults([]);
                }}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {entry}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuery("");
            setFilteredResults([]);
            onCancel && onCancel();
          }}
          className="mt-2 border rounded p-2 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default TileEditor;
