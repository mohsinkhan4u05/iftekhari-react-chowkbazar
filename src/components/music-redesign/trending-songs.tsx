import React, { useRef, useState, useEffect } from "react";
import { Track } from "@contexts/music-player.context";
import { useMusicPlayer } from "@contexts/music-player.context";
import { FaPlay, FaChevronLeft, FaChevronRight, FaPause } from "react-icons/fa";

interface TrendingSongsProps {
  tracks: Track[];
  loading: boolean;
  showAll?: boolean;
}

const TrendingSongs: React.FC<TrendingSongsProps> = ({
  tracks,
  loading,
  showAll = false,
}) => {
  const { playTrack, state, pause, resume } = useMusicPlayer();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if we need to show arrows
  const checkArrows = () => {
    if (scrollContainerRef.current && !showAll) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Add event listener for scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !showAll) {
      container.addEventListener("scroll", checkArrows);
      checkArrows(); // Initial check
      return () => container.removeEventListener("scroll", checkArrows);
    }
  }, [tracks, showAll]);

  // Handle play/pause for a track
  const handlePlayPause = (track: Track) => {
    if (state.currentTrack?.id === track.id) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playTrack(track, tracks, "Trending Songs");
    }
  };

  if (loading) {
    if (showAll) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 animate-pulse"
            >
              <div className="bg-gray-700 rounded-lg w-full aspect-square mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-48 bg-gray-800 rounded-lg p-4 animate-pulse"
            >
              <div className="bg-gray-700 rounded-lg w-full h-48 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showAll) {
    // Grid layout for "show all" mode
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {tracks.map((track) => {
          const isCurrentTrack = state.currentTrack?.id === track.id;
          const isPlaying = isCurrentTrack && state.isPlaying;

          return (
            <div
              key={track.id}
              className="bg-gray-800 bg-opacity-50 hover:bg-gray-700 rounded-lg p-4 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                {track.cover ? (
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="bg-gray-600 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                )}
                <button
                  onClick={() => handlePlayPause(track)}
                  className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 shadow-lg hover:scale-105 transform transition-all duration-200"
                >
                  {isPlaying ? (
                    <FaPause className="text-black" />
                  ) : (
                    <FaPlay className="text-black ml-0.5" />
                  )}
                </button>
              </div>
              <h3 className="font-semibold truncate">{track.title}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist}</p>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal scrolling layout for normal mode
  return (
    <div className="relative">
      {/* Left arrow */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition-all duration-200"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={20} />
        </button>
      )}

      {/* Right arrow */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition-all duration-200"
          aria-label="Scroll right"
        >
          <FaChevronRight size={20} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
        onScroll={checkArrows}
      >
        {tracks.map((track) => {
          const isCurrentTrack = state.currentTrack?.id === track.id;
          const isPlaying = isCurrentTrack && state.isPlaying;

          return (
            <div
              key={track.id}
              className="flex-shrink-0 w-48 bg-gray-800 bg-opacity-50 hover:bg-gray-700 rounded-lg p-4 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                {track.cover ? (
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="bg-gray-600 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                )}
                <button
                  onClick={() => handlePlayPause(track)}
                  className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:scale-105 transform"
                >
                  {isPlaying ? (
                    <FaPause className="text-black" />
                  ) : (
                    <FaPlay className="text-black ml-0.5" />
                  )}
                </button>
              </div>
              <h3 className="font-semibold truncate">{track.title}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingSongs;
