import React from "react";
import {
  FaPlay,
  FaPause,
  FaArrowLeft,
  FaHeart,
  FaEllipsisH,
} from "react-icons/fa";
import { PlaylistWithTracks } from "../../framework/music/get-playlists";
import TrackCard from "@components/music/track-card";
import { useMusicPlayer } from "@contexts/music-player.context";

interface PlaylistDetailProps {
  playlist: PlaylistWithTracks;
  onClose: () => void;
  onTrackRemoved?: () => void;
}

const PlaylistDetail: React.FC<PlaylistDetailProps> = ({
  playlist,
  onClose,
}) => {
  const { state, playTrack, pause, resume } = useMusicPlayer();

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayAll = () => {
    if (!playlist.tracks?.length) return;

    const isPlayingThisPlaylist = state.currentPlaylistName === playlist.name;
    const isPlaying = state.isPlaying && isPlayingThisPlaylist;

    if (isPlayingThisPlaylist) {
      isPlaying ? pause() : resume();
    } else {
      playTrack(playlist.tracks[0], playlist.tracks, playlist.name);
    }
  };

  const isPlayingThisPlaylist = state.currentPlaylistName === playlist.name;
  const isPlaying = state.isPlaying && isPlayingThisPlaylist;

  // Local state for tracks to allow UI refresh after removal
  const [tracks, setTracks] = React.useState(playlist.tracks || []);
  React.useEffect(() => {
    setTracks(playlist.tracks || []);
  }, [playlist.tracks]);

  // Ensure all tracks have a string url property
  const safeTracks = (tracks || []).map((track) => ({
    ...track,
    url: track.url || "",
  }));

  // Handler to remove a track from local state after successful backend removal
  const handleRemoveTrack = (trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    if (typeof onTrackRemoved === "function") {
      onTrackRemoved();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {/* Back Button */}
      <div className="p-4 md:p-6">
        <button
          onClick={onClose}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end px-6 pb-6">
        {playlist.coverImageUrl ? (
          <div className="w-64 h-64 md:w-80 md:h-80 shadow-2xl mb-6 md:mb-0 md:mr-8">
            <img
              src={playlist.coverImageUrl}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-900 to-blue-900 rounded-md shadow-2xl mb-6 md:mb-0 md:mr-8 flex items-center justify-center">
            <span className="text-6xl font-bold text-white opacity-50">
              {playlist.name?.charAt(0) || "P"}
            </span>
          </div>
        )}

        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
            Playlist
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {playlist.name}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center text-gray-300 mb-6">
            <span className="mb-2 md:mb-0 md:mr-4">{playlist.description}</span>
            <span className="mb-2 md:mb-0 md:mr-4">
              {playlist.totalTracks} tracks
            </span>
            <span className="mb-2 md:mb-0 md:mr-4">
              {formatDuration(playlist.totalDuration)}
            </span>
            <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <button
              onClick={handlePlayAll}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              <span>{isPlaying ? "Pause" : "Play All"}</span>
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <FaHeart size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <FaEllipsisH size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="border-t border-gray-800">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Tracks</h3>
          <div className="space-y-1">
            {safeTracks.length > 0 ? (
              safeTracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlist={safeTracks}
                  playlistName={playlist.name}
                  playlistId={playlist.id}
                  index={index}
                  showRemoveButton={true}
                  onRemove={() => handleRemoveTrack(track.id)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tracks in this playlist yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
