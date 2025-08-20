import React, { useState } from "react";
import SectionCarousel from "./SectionCarousel";

interface SearchResult {
  albums: any[];
  artists: any[];
  tracks: any[];
}

const MusicSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    albums: [],
    artists: [],
    tracks: [],
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `/api/music/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          placeholder="Search albums, artists, tracks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg"
        >
          Search
        </button>
      </form>

      {/* 🔹 Search Suggestion Dropdown */}
      {query && results.tracks.length > 0 && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-[600px] max-h-[400px] overflow-y-auto bg-gray-800 text-white shadow-2xl rounded-lg z-[9999] p-4">
          {results.tracks.slice(0, 8).map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer rounded"
              onClick={() => (window.location.href = `/music/tracks/${t.id}`)}
            >
              <img
                src={t.coverImageUrl || "/placeholder.png"}
                alt={t.title}
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <p className="text-sm font-medium">{t.title}</p>
                <p className="text-xs text-gray-400">{t.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicSearch;
