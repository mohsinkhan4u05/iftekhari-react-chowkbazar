import React from "react";
import { Track, useMusicPlayer } from "@contexts/music-player.context";
import { useSession } from "next-auth/react";
import { usePlaylist } from "@contexts/playlist.context";
import {
  FaPlay,
  FaPause,
  FaPlus,
  FaEllipsisH,
  FaHeart,
  FaMusic,
} from "react-icons/fa";

interface TrackCardProps {
  track: Track;
  index: number;
  playlist?: Track[];
  playlistName?: string;
  onAddToPlaylist?: (track: Track) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  index,
  playlist = [],
  playlistName = "",
  onAddToPlaylist,
}) => {
  const { state, playTrack, pause, resume } = useMusicPlayer();
  const { data: session } = useSession();
  const { playlists } = usePlaylist();
  const [showOptions, setShowOptions] = React.useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;

  console.log("track :", track);

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playTrack(track, playlist, playlistName);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddToPlaylist = (playlistId: string) => {
    // Debug log for Add to Playlist
    console.log(
      `DEBUG: Add to Playlist clicked for track ${track.id}, playlist ${playlistId}`
    );
    // In a real implementation, this would call the API to add the track to a playlist
    setShowAddToPlaylist(false);
  };

  return (
    <div
      className={`group flex items-center p-2 rounded-lg transition-all duration-200 ease-in-out transform ${
        isCurrentTrack
          ? "bg-gray-800"
          : "hover:bg-gray-800 hover:-translate-y-0.5"
      } will-change-transform`}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setShowOptions(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setShowOptions(false);
        setShowAddToPlaylist(false);
      }}
    >
      {/* Track Number / Play Button */}
      <div className="relative w-10 h-10 rounded mr-4 flex-shrink-0 overflow-hidden group">
        {/* Hide cover image when mouse over or when song is playing */}
        {!(showOptions || isPlaying) ? (
          track.cover || track.coverImage ? (
            <img
              src={track.cover || track.coverImage}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <FaMusic className="text-gray-500" />
            </div>
          )
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center" />
        )}
        <button
          onClick={handlePlayClick}
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity ${
            showOptions || isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {isPlaying ? (
            <FaPause size={18} className="text-green-500" />
          ) : (
            <FaPlay size={18} className="text-white" />
          )}
        </button>
      </div>
      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-medium truncate ${
            isCurrentTrack ? "text-green-500" : "text-white"
          }`}
        >
          {track.title}
        </h4>
        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
      </div>
      {/* Album Name (hidden on mobile) */}
      <div className="hidden md:block flex-1 min-w-0 mx-4">
        <p className="text-xs text-gray-400 truncate">{track.album}</p>
      </div>
      {/* Like Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className={`hidden md:flex p-2 mr-2 rounded-full hover:bg-gray-700 ${
          isLiked ? "text-green-500" : "text-gray-400"
        }`}
      >
        <FaHeart size={14} />
      </button>
      {/* Duration */}
      <div className="text-xs text-gray-400 w-12 text-right mr-4">
        {formatDuration(track.duration)}
      </div>
      {/* Options Button - Plus icon opens AddToPlaylistModal */}
      <div className={`relative ${showOptions ? "" : "hidden"} md:block`}>
        <button
          onClick={() => {
            if (typeof onAddToPlaylist === "function") {
              onAddToPlaylist(track);
            }
          }}
          className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          <FaPlus size={14} />
        </button>
      </div>
      {/* Always show on mobile */}
      <div className="relative md:hidden">
        <button
          onClick={() => {
            if (typeof onAddToPlaylist === "function") {
              onAddToPlaylist(track);
            }
          }}
          className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
        >
          <FaPlus size={14} />
        </button>
      </div>
    </div>
  );
};

export default TrackCard;
