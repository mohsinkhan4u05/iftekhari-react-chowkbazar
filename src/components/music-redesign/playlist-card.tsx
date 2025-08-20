import React from "react";
import { useRouter } from "next/router";
import { FaMusic, FaPlay, FaPause } from "react-icons/fa";
import { Playlist } from "../../framework/music/get-playlists";

interface PlaylistCardProps {
  playlist: Playlist;
  isSelected?: boolean;
  isPlaying?: boolean;
  onClick: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
}

// Helper for random gradient
function getRandomGradient(seed: string) {
  const gradients = [
    "from-pink-500 via-red-500 to-yellow-500",
    "from-green-400 via-blue-500 to-purple-500",
    "from-yellow-400 via-red-500 to-pink-500",
    "from-blue-400 via-indigo-500 to-purple-500",
    "from-purple-400 via-pink-500 to-red-500",
    "from-teal-400 via-green-500 to-blue-500",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

// FallbackCover component for initial letter and random gradient
const FallbackCover: React.FC<{ name: string }> = ({ name }) => {
  const gradient = getRandomGradient(name || "P");
  const letter = name?.toUpperCase() || "P";
  return (
    <div
      className={`w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br ${gradient} rounded-lg`}
    >
      {letter}
    </div>
  );
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isSelected = false,
  isPlaying = false,
  onClick,
  onPlayClick,
}) => {
  const router = useRouter();
  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayClick?.(e);
  };

  const handleCardClick = () => {
    router.push({ pathname: "/music", query: { playlistId: playlist.id } });
  };

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Cover Image */}
      <div className="aspect-square relative overflow-hidden">
        {playlist.coverImageUrl ? (
          <img
            src={playlist.coverImageUrl}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
          />
        ) : (
          <FallbackCover name={playlist.name} />
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg"
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
        </div>
      </div>

      {/* Playlist Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {playlist.totalTracks} tracks •{" "}
          {formatDuration(playlist.totalDuration)}
        </p>
        {playlist.description && (
          <p className="text-xs text-gray-400 mt-1 truncate">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;
