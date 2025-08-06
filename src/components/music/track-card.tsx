import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaPlus, FaMinus } from "react-icons/fa";
import { Track, useMusicPlayer } from "@contexts/music-player.context";
import { usePlaylist } from "@contexts/playlist.context";
import { useSession } from "next-auth/react";
import { ToastNotification } from "@components/ui/toast-notification";

interface TrackCardProps {
  track: Track;
  playlist?: Track[];
  playlistName?: string;
  index?: number;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  playlist = [],
  playlistName = "",
  index,
  showRemoveButton = false,
  onRemove,
}) => {
  const { state, playTrack, pause, resume } = useMusicPlayer();
  const { data: session } = useSession();
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist } =
    usePlaylist();
  const [mounted, setMounted] = useState(false);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");
  const [toastType, setToastType] = useState<"success" | "warning" | "error">(
    "success"
  );
  const [toastTitle, setToastTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Prevent hydration mismatch by only rendering interactive elements after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;

  const handlePlayClick = () => {
    if (!mounted) return; // Don't handle clicks until mounted

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

  const handleAddToPlaylistClick = () => {
    setShowPlaylistDropdown(!showPlaylistDropdown);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      const selectedPlaylist = playlists.find((p) => p.id === playlistId);
      const result = await addTrackToPlaylist(playlistId, track.id);

      setShowPlaylistDropdown(false);
      setSelectedPlaylistName(selectedPlaylist?.name || "Unknown Playlist");

      if (result.success) {
        if (result.alreadyExists) {
          // Show warning toast for duplicate track
          setToastType("warning");
          setToastTitle("Track Already Exists");
          setToastMessage(
            `This track is already in "${
              selectedPlaylist?.name || "playlist"
            }".`
          );
          setToastVisible(true);
        } else {
          // Show success toast for new track added
          setToastType("success");
          setToastTitle("Track Added Successfully!");
          setToastMessage("Track has been added to your playlist.");
          setToastVisible(true);
        }
      } else {
        // Show error toast for failed operation
        setToastType("error");
        setToastTitle("Failed to Add Track");
        setToastMessage(
          result.message ||
            "Unknown error occurred while adding track to playlist."
        );
        setToastVisible(true);
      }
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      setShowPlaylistDropdown(false);

      // Show error toast for exception
      setToastType("error");
      setToastTitle("Error");
      setToastMessage("Failed to add track to playlist. Please try again.");
      setSelectedPlaylistName(""); // Clear playlist name for error case
      setToastVisible(true);
    }
  };

  const handleRemoveFromPlaylist = async () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div
      className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group ${
        isCurrentTrack ? "bg-green-50" : ""
      }`}
    >
      {/* Track Number / Play Button */}
      <div className="w-8 flex justify-center mr-4">
        {index !== undefined && (
          <span
            className={`text-sm ${
              isCurrentTrack ? "text-green-600" : "text-gray-500"
            } group-hover:hidden`}
          >
            {index + 1}
          </span>
        )}
        <button
          onClick={handlePlayClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            index !== undefined ? "hidden group-hover:flex" : "flex"
          } ${
            isCurrentTrack
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
          }`}
        >
          {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>
      </div>

      {/* Track Cover */}
      <div className="w-12 h-12 rounded mr-4 flex-shrink-0 overflow-hidden">
        {track.cover || track.coverImage ? (
          <img
            src={track.cover || track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Show default placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              if (target.nextElementSibling) {
                (target.nextElementSibling as HTMLElement).style.display =
                  "flex";
              }
            }}
          />
        ) : null}

        {/* Default placeholder - always present but hidden if image loads */}
        <div
          className={`w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center ${
            track.cover || track.coverImage ? "hidden" : "flex"
          }`}
          style={{
            display: track.cover || track.coverImage ? "none" : "flex",
          }}
        >
          <svg
            className="w-6 h-6 text-white opacity-80"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-medium truncate ${
            isCurrentTrack ? "text-green-600" : "text-gray-900"
          }`}
        >
          {track.title}
        </h4>
        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
      </div>

      {/* Album Name */}
      {/* {track.album && (
        <div className="hidden md:block flex-1 min-w-0 mx-4">
          <p className="text-xs text-gray-500 truncate">{track.album}</p>
        </div>
      )} */}

      {/* Duration */}
      <div className="text-xs text-gray-500 ml-4">
        {formatDuration(track.duration)}
      </div>

      {/* Add to Playlist Button */}
      {session && mounted && (
        <div className="relative ml-4">
          <button
            onClick={handleAddToPlaylistClick}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add to playlist"
          >
            <FaPlus size={14} />
          </button>

          {/* Playlist Dropdown */}
          {showPlaylistDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1 max-h-48 overflow-y-auto">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {playlist.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No playlists available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Remove from Playlist Button */}
      {showRemoveButton && mounted && (
        <div className="ml-4">
          <button
            onClick={handleRemoveFromPlaylist}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove from playlist"
          >
            <FaMinus size={14} />
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastVisible && (
        <ToastNotification
          type={toastType}
          title={toastTitle}
          message={toastMessage}
          onClose={() => setToastVisible(false)}
          trackTitle={track.title}
          playlistName={selectedPlaylistName}
        />
      )}
    </div>
  );
};

export default TrackCard;
