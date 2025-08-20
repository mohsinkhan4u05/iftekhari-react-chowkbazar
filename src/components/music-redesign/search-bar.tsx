import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useSearchQuery } from "../../framework/music/get-search";
import { useClickAway } from "react-use";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Debounce input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Call your search API hook
  const { data: searchResults, isLoading } = useSearchQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length > 0 }
  );

  // Close overlay when clicking outside
  useClickAway(overlayRef, () => {
    setIsFocused(false);
  });

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search input */}
      <div className="flex items-center bg-neutral-900 text-white px-3 py-2 rounded-full shadow-md">
        <FaSearch className="mr-2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="What do you want to listen to?"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="bg-transparent w-full outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute mt-2 w-full bg-neutral-950 text-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-[9999] p-4"
          >
            {isLoading && <p className="text-gray-400">Loading...</p>}

            {!isLoading && searchResults ? (
              <>
                {/* Tracks */}
                {searchResults.tracks?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-sm text-gray-300">
                      Tracks
                    </h3>
                    {searchResults.tracks.map((track: any) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-3 hover:bg-neutral-800 p-2 rounded-lg cursor-pointer"
                      >
                        <img
                          src={track.coverImage || "/default-track.png"}
                          alt={track.title}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <p className="font-medium">{track.title}</p>
                          <p className="text-xs text-gray-400">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Albums */}
                {searchResults.albums?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-sm text-gray-300">
                      Albums
                    </h3>
                    {searchResults.albums.map((album: any) => (
                      <div
                        key={album.id}
                        className="flex items-center gap-3 hover:bg-neutral-800 p-2 rounded-lg cursor-pointer"
                      >
                        <img
                          src={album.coverImage || "/default-album.png"}
                          alt={album.title}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <p className="font-medium">{album.title}</p>
                          <p className="text-xs text-gray-400">
                            {album.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Artists */}
                {searchResults.artists?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-gray-300">
                      Artists
                    </h3>
                    {searchResults.artists.map((artist: any) => (
                      <div
                        key={artist.id}
                        className="flex items-center gap-3 hover:bg-neutral-800 p-2 rounded-lg cursor-pointer"
                      >
                        <img
                          src={artist.image || "/default-artist.png"}
                          alt={artist.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{artist.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              !isLoading && (
                <p className="text-gray-500 text-center">No results found</p>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
