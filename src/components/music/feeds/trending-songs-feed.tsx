import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@utils/routes";
import { useTrendingSongsQuery } from "../../../framework/music/get-trending-songs";
import { useMusicPlayer } from "@contexts/music-player.context";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";

interface Track {
  id: number;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  coverImage?: string;
  duration?: string;
  plays?: number;
  isLiked?: boolean;
  audioUrl?: string;
}

interface TrendingSongsFeedProps {
  className?: string;
  type?: string;
  limit?: number;
  sectionHeading?: string;
  showViewAll?: boolean;
}

const TrendingSongsFeed: React.FC<TrendingSongsFeedProps> = ({
  className = "mb-7 md:mb-10 lg:mb-12 xl:mb-14 2xl:mb-[75px]",
  type = "trending",
  limit = 10,
  sectionHeading = "Trending Kalam",
  showViewAll = true,
}) => {
  const { state, playTrack, pause, resume } = useMusicPlayer();
  const { data, isLoading, error } = useTrendingSongsQuery({
    limit,
    type: type as "trending" | "popular" | "mostPlayed",
  });
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());

  // Use fetched data or empty array as fallback
  const trendingSongs = data?.data || [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel for horizontal scrolling on desktop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent vertical scrolling when over the container
      e.preventDefault();
      // Scroll horizontally using deltaY (wheel up/down)
      scrollContainer.scrollLeft += e.deltaY;
    };

    // Add event listener with passive: false to allow preventDefault
    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup event listener on unmount
    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handlePlayTrack = (track: Track) => {
    if (state.currentTrack?.id === track.id) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playTrack(track);
    }
  };

  const toggleLike = (trackId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedTracks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const isCurrentTrack = (trackId: number) =>
    state.currentTrack?.id === trackId;
  const isPlaying = (trackId: number) =>
    isCurrentTrack(trackId) && state.isPlaying;

  return (
    <div className={className}>
      {/* CSS for hiding scrollbars */}
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-heading">
          {sectionHeading}
        </h2>

        <div className="flex items-center gap-3">
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {showViewAll && (
            <Link
              href={ROUTES.MUSIC}
              className="inline-flex items-center text-sm text-gray-600 hover:text-heading transition-colors duration-200"
            >
              View All
              <svg
                className="ml-1 w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Songs Horizontal Scroll */}
      {error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error loading trending kalam. Please try again later.</p>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="scroll-container flex flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {isLoading
              ? // Loading skeleton
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex-shrink-0 w-48 animate-pulse">
                    <div className="bg-gray-200 rounded-lg w-48 h-48 mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded mb-2 w-32"></div>
                    <div className="bg-gray-200 h-3 rounded w-20"></div>
                  </div>
                ))
              : trendingSongs.slice(0, limit).map((track) => (
                  <div
                    key={track.id}
                    className="flex-shrink-0 group w-48 hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={() => handlePlayTrack(track)}
                  >
                    {/* Album Cover */}
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 w-48 h-48 mb-3 group-hover:shadow-lg transition-shadow duration-200">
                      <img
                        src={
                          track.cover ||
                          track.coverImage ||
                          "/assets/images/placeholder-blur.jpg"
                        }
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/images/placeholder-blur.jpg";
                        }}
                      />

                      {/* Play/Pause Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <button
                          className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform scale-90 group-hover:scale-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track);
                          }}
                        >
                          {isPlaying(track.id) ? (
                            <FaPause className="w-4 h-4 text-gray-800" />
                          ) : (
                            <FaPlay className="w-4 h-4 text-gray-800 ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Like Button */}
                      <button
                        className="absolute top-3 right-3 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        onClick={(e) => toggleLike(track.id, e)}
                      >
                        {likedTracks.has(track.id) ? (
                          <FaHeart className="w-4 h-4 text-red-500" />
                        ) : (
                          <FaRegHeart className="w-4 h-4 text-white" />
                        )}
                      </button>

                      {/* Current Playing Indicator */}
                      {isCurrentTrack(track.id) && (
                        <div className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                          {isPlaying(track.id) ? "Playing" : "Paused"}
                        </div>
                      )}

                      {/* Plays badge */}
                      {track.plays && (
                        <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md font-medium">
                          {formatPlays(track.plays)} plays
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm text-heading line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {truncateText(track.title, 40)}
                      </h3>

                      <p className="text-xs text-gray-600 truncate">
                        by {truncateText(track.artist, 30)}
                      </p>

                      {/* {track.album && (
                        <p className="text-xs text-gray-500 truncate">
                          {truncateText(track.album, 30)}
                        </p>
                      )} */}

                      {/* <div className="flex items-center justify-between">
                        {track.duration && (
                          <span className="text-xs text-gray-500">
                            {track.duration}
                          </span>
                        )}

                        {track.plays && (
                          <span className="flex items-center text-xs text-gray-500">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-6a2 2 0 012-2h2a2 2 0 012 2v6M12 18.5A2.5 2.5 0 019.5 16v0A2.5 2.5 0 0112 13.5v0a2.5 2.5 0 012.5 2.5v0A2.5 2.5 0 0112 18.5z"
                              />
                            </svg>
                            {formatPlays(track.plays)}
                          </span>
                        )}
                      </div> */}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingSongsFeed;
