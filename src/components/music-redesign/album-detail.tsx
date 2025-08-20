import React, { useState, useEffect } from "react";
import AddToPlaylistModal from "./add-to-playlist-modal";
import CreatePlaylistModal from "./create-playlist-modal";
import { useRouter } from "next/router";
import { useMusicPlayer } from "@contexts/music-player.context";
import TrackCard from "./track-card";
import { FaPlay, FaPause, FaArrowLeft, FaEllipsisH } from "react-icons/fa";

interface AlbumTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  audioUrl?: string;
  cover?: string;
  coverImage?: string;
  albumId?: string;
}

interface AlbumDetailProps {
  albumId: string;
}

const AlbumDetail: React.FC<AlbumDetailProps> = ({ albumId }) => {
  console.log("Rendering AlbumDetail with albumId:", albumId);
  const router = useRouter();
  const { state, playTrack, pause, resume } = useMusicPlayer();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for Add to Playlist Modal
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<null | {
    id: string;
    title: string;
    artist: string;
  }>(null);

  useEffect(() => {
    if (!albumId) return;

    const fetchAlbum = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/music/albums/${albumId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch album");
        }

        const albumData = await response.json();
        setAlbum(albumData);
      } catch (err) {
        console.error("Error fetching album:", err);
        setError("Failed to load album details");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  // Listen for global event to open CreatePlaylistModal from track dropdown
  useEffect(() => {
    const handler = () => setShowCreateModal(true);
    window.addEventListener("openCreatePlaylistModal", handler);
    return () => window.removeEventListener("openCreatePlaylistModal", handler);
  }, []);

  const handlePlayAll = () => {
    if (!album?.tracks?.length) return;

    const isPlayingThisAlbum = state.currentPlaylistName === album.title;
    const isPlaying = state.isPlaying && isPlayingThisAlbum;

    if (isPlayingThisAlbum) {
      isPlaying ? pause() : resume();
    } else {
      playTrack(album.tracks[0], album.tracks, album.title);
    }
  };

  const handleBack = () => {
    router.push("/music");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Album Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The album you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isPlayingThisAlbum = state.currentPlaylistName === album.title;
  const isPlaying = state.isPlaying && isPlayingThisAlbum;

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {/* Back Button */}
      <div className="p-4 md:p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end px-6 pb-6">
        {album.coverImageUrl ? (
          <div className="w-64 h-64 md:w-80 md:h-80 shadow-2xl mb-6 md:mb-0 md:mr-8">
            <img
              src={album.coverImageUrl}
              alt={album.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ) : (
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-900 to-blue-900 rounded-md shadow-2xl mb-6 md:mb-0 md:mr-8 flex items-center justify-center">
            <span className="text-6xl font-bold text-white opacity-50">
              {album.title?.charAt(0) || "A"}
            </span>
          </div>
        )}

        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
            Album
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{album.title}</h1>
          <div className="flex flex-col md:flex-row md:items-center text-gray-300 mb-6">
            <span className="mb-2 md:mb-0 md:mr-4">{album.artist}</span>
            <span className="hidden md:block">•</span>
            <span className="mb-2 md:mb-0 md:mx-4">
              {new Date(album.releaseDate).getFullYear()}
            </span>
            <span className="hidden md:block">•</span>
            <span className="md:ml-4">
              {album.tracks?.length || 0} songs,{" "}
              {album.tracks?.reduce(
                (total: number, track: any) => total + (track.duration || 0),
                0
              ) > 0
                ? formatDuration(
                    album.tracks.reduce(
                      (total: number, track: any) =>
                        total + (track.duration || 0),
                      0
                    )
                  )
                : "0:00"}
            </span>
          </div>
          <button
            onClick={handlePlayAll}
            className="bg-green-500 hover:bg-green-400 text-black font-bold rounded-full w-14 h-14 flex items-center justify-center transition-colors shadow-lg hover:scale-105"
          >
            {isPlaying ? (
              <FaPause size={24} />
            ) : (
              <FaPlay size={24} className="ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-24">
        <div className="bg-black bg-opacity-30 rounded-lg">
          <div className="border-b border-gray-800 px-4 py-2 hidden md:grid grid-cols-12 text-gray-400 text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-4">Album</div>
            <div className="col-span-2 text-right">Duration</div>
          </div>
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
            {/* Pass album.tracks and album.title to each TrackCard for correct persistence */}
            {album.tracks?.map((track: any, idx: number) => (
              <TrackCard
                key={track.id}
                track={track}
                index={idx}
                playlist={album.tracks}
                playlistName={album.title}
                onAddToPlaylist={(track: any) => {
                  setAddToPlaylistTrack({
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Add To Playlist Modal */}
      {addToPlaylistTrack && (
        <AddToPlaylistModal
          isOpen={!!addToPlaylistTrack}
          onClose={() => setAddToPlaylistTrack(null)}
          trackId={addToPlaylistTrack.id}
          trackTitle={addToPlaylistTrack.title}
          trackArtist={addToPlaylistTrack.artist}
        />
      )}
    </div>
  );
};

export default AlbumDetail;
