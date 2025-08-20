import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlus } from "react-icons/fa";
import AddToPlaylistModal from "./add-to-playlist-modal";
import { useSearchQuery } from "../../framework/music/get-search"; // your API hook
import { useMusicPlayer } from "@contexts/music-player.context";
import { useRouter } from "next/router";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { playTrack } = useMusicPlayer();
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<null | {
    id: string;
    title: string;
    artist: string;
  }>(null);
  const router = useRouter();
  const { data, isLoading } = useSearchQuery({
    query: debouncedQuery,
    enabled: !!debouncedQuery.trim(),
  });

  // debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const fallbackImage = "/assets/images/placeholder-blur.jpg";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header with input + close */}
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search songs, albums, artists, playlists..."
              value={query}
              onChange={handleInputChange}
              autoFocus
              className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none text-lg"
            />
            <button onClick={onClose} className="ml-4 text-white text-2xl">
              <FaTimes />
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-gray-400 text-center mt-10">Searching...</div>
          )}

          {/* No results */}
          {!isLoading && debouncedQuery && !data && (
            <div className="text-gray-400 text-center mt-10">
              No results found
            </div>
          )}

          {/* Results */}
          {!isLoading && data && (
            <div className="space-y-10">
              {/* Tracks */}
              {data.tracks?.length > 0 && (
                <div>
                  <h2 className="text-xl text-white font-semibold mb-3">
                    Tracks
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.tracks.map((track: any) => (
                      <div
                        key={track.id}
                        className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg hover:bg-gray-700"
                      >
                        <img
                          src={track.coverImage || fallbackImage}
                          alt={track.title}
                          className="w-12 h-12 rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== fallbackImage) {
                              target.src = fallbackImage;
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {track.title}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {track.artist}
                          </p>
                        </div>
                        <button
                          className="ml-2 bg-green-500 hover:bg-green-400 text-black rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-lg"
                          title="Play"
                          onClick={() => playTrack(track)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.25 5.25v13.5l13.5-6.75-13.5-6.75z"
                            />
                          </svg>
                        </button>
                        <button
                          className="ml-2 bg-blue-500 hover:bg-blue-400 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-lg"
                          title="Add to Playlist"
                          onClick={() =>
                            setAddToPlaylistTrack({
                              id: track.id,
                              title: track.title,
                              artist: track.artist,
                            })
                          }
                        >
                          <FaPlus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Albums */}
              {data.albums?.length > 0 && (
                <div>
                  <h2 className="text-xl text-white font-semibold mb-3">
                    Albums
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {data.albums.map((album: any) => (
                      <div
                        key={album.id}
                        className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          router.push(`/music?albumId=${album.id}`);
                          onClose();
                        }}
                      >
                        <img
                          src={album.coverImageUrl || "/placeholder.png"}
                          alt={album.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <p className="text-white font-medium mt-2">
                          {album.title}
                        </p>
                        <p className="text-gray-400 text-sm">{album.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artists */}
              {data.artists?.length > 0 && (
                <div>
                  <h2 className="text-xl text-white font-semibold mb-3">
                    Artists
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {data.artists.map((artist: any) => (
                      <div
                        key={artist.id}
                        className="flex flex-col items-center text-center cursor-pointer"
                        onClick={() => {
                          router.push(`/music?artistId=${artist.id}`);
                          onClose();
                        }}
                      >
                        <img
                          src={artist.profileImageUrl || "/placeholder.png"}
                          alt={artist.name}
                          className="w-24 h-24 rounded-full object-cover mb-2"
                        />
                        <p className="text-white">{artist.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists */}
              {data.playlists?.length > 0 && (
                <div>
                  <h2 className="text-xl text-white font-semibold mb-3">
                    Playlists
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {data.playlists.map((pl: any) => (
                      <div
                        key={pl.id}
                        className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
                      >
                        <img
                          src={pl.coverImage || "/placeholder.png"}
                          alt={pl.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <p className="text-white font-medium mt-2">
                          {pl.title}
                        </p>
                        <p className="text-gray-400 text-sm">{pl.owner}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Add To Playlist Modal for Search Tracks */}
          {addToPlaylistTrack && (
            <AddToPlaylistModal
              isOpen={!!addToPlaylistTrack}
              onClose={() => setAddToPlaylistTrack(null)}
              trackId={addToPlaylistTrack.id}
              trackTitle={addToPlaylistTrack.title}
              trackArtist={addToPlaylistTrack.artist}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
