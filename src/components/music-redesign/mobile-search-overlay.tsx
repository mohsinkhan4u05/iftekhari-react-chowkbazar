import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useSearchQuery } from "../../framework/music/get-search";
import { useMusicPlayer } from "@contexts/music-player.context";

const trendingTerms = [
  "Nusrat Fateh Ali Khan",
  "Qawwali",
  "Sufi",
  "Sabri Brothers",
  "Devotional",
  "Classics",
];
const categories = ["Songs", "Artists", "Albums", "Playlists"];
const mockHistory = ["Mast Kalandar", "Sufi Classics", "Sabri Brothers"];

export default function MobileSearchOverlay({
  onClose,
}: {
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: searchResults, isLoading } = useSearchQuery({
    query,
    enabled: query.length > 0,
    limit: 20,
  });
  const { playTrack } = useMusicPlayer();

  const grouped = {
    Songs: searchResults?.tracks || [],
    Artists: searchResults?.artists || [],
    Albums: searchResults?.albums || [],
    Playlists: searchResults?.playlists || [],
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.25 }}
        // ✅ Position & height so it stops above bottom nav
        className="fixed inset-x-0 top-0 bottom-[56px] z-40 bg-black bg-opacity-95 flex flex-col md:hidden overflow-y-auto"
      >
        <div className="relative w-full px-4 pt-8 pb-4">
          {/* Close button */}
          <button
            className="absolute top-4 right-6 text-gray-400 hover:text-white text-2xl"
            onClick={onClose}
          >
            <FaTimes />
          </button>

          {/* Search box */}
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search songs, artists, albums..."
              className="w-full bg-gray-800 text-white rounded-full py-3 px-5 pl-4 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-700 transition-all duration-200 placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Trending, Categories, History */}
          {(!query || !focused) && (
            <div className="mb-6">
              {/* Trending Searches */}
              <div className="mb-3">
                <h3 className="text-gray-400 text-xs font-semibold mb-2">
                  Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTerms.map((term) => (
                    <button
                      key={term}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs hover:bg-green-600 hover:text-white"
                      onClick={() => setQuery(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-3">
                <h3 className="text-gray-400 text-xs font-semibold mb-2">
                  Categories
                </h3>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Search History */}
              <div>
                <h3 className="text-gray-400 text-xs font-semibold mb-2">
                  Search History
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockHistory.map((h) => (
                    <button
                      key={h}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs hover:bg-green-600 hover:text-white"
                      onClick={() => setQuery(h)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Results */}
          {query && (
            <div>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                Object.entries(grouped).map(([type, items]) =>
                  items.length ? (
                    <div key={type} className="mb-6">
                      <h4 className="text-green-500 text-sm font-bold mb-2">
                        {type}
                      </h4>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {items.map((item: any) => (
                          <div
                            key={item.id}
                            className="min-w-[180px] max-w-[220px] bg-gray-800 rounded-lg p-3 flex flex-col items-center shadow hover:bg-gray-700 transition-all"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name || item.title}
                                className="w-16 h-16 rounded mb-2 object-cover"
                              />
                            )}
                            <div className="text-white font-medium text-base truncate text-center">
                              {item.name || item.title}
                            </div>
                            <div className="text-gray-400 text-xs truncate text-center">
                              {item.artist || item.album || item.subtitle || ""}
                            </div>
                            {type === "Songs" && (
                              <button
                                className="mt-2 px-3 py-1 bg-green-600 text-white rounded-full text-xs"
                                onClick={() => playTrack(item)}
                              >
                                Play
                              </button>
                            )}
                            <span className="mt-2 text-[10px] px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full">
                              {type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )
              )}
              {!isLoading &&
                Object.values(grouped).every((arr) => !arr.length) && (
                  <div className="text-center py-8 text-gray-400">
                    No results found.
                  </div>
                )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
