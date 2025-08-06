import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import Layout from "@components/layout/layout";
import TrackCard from "@components/music/track-card";
import { Track } from "@contexts/music-player.context";
import { FaPlay, FaSpinner, FaMusic, FaArrowLeft } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMusicPlayer } from "@contexts/music-player.context";
import { usePlaylist } from "@contexts/playlist.context";
import { RemoveTrackModal } from "@components/music/remove-track-modal";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  trackCount: number;
  createdAt: string;
  updatedAt: string;
  tracks: Track[];
}

const PlaylistDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { playTrack } = useMusicPlayer();
  const { removeTrackFromPlaylist } = usePlaylist();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackToRemove, setTrackToRemove] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchPlaylistDetails();
    }
  }, [id, session]);

  const fetchPlaylistDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/music/playlists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }
      const data = await response.json();
      setPlaylist(data.playlist);
    } catch (err) {
      setError('Error loading playlist');
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], playlist.tracks, playlist.name);
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!playlist?.id) return;
    
    try {
      const success = await removeTrackFromPlaylist(playlist.id, trackId);
      if (success) {
        // Refresh playlist data
        await fetchPlaylistDetails();
      }
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const openRemoveModal = (track: Track) => {
    setTrackToRemove({ id: track.id, title: track.title });
  };

  const closeRemoveModal = () => {
    setTrackToRemove(null);
  };

  const confirmRemoveTrack = async () => {
    if (trackToRemove) {
      await handleRemoveTrack(trackToRemove.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaMusic className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Playlist not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The playlist you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/music')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Music
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => router.push('/music')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Music Library</span>
        </button>

        {/* Playlist Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Playlist Cover */}
            <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
              {playlist.cover ? (
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaMusic className="w-16 h-16 mx-auto mb-2 opacity-80" />
                    <p className="text-lg font-medium opacity-90">
                      {playlist.name.charAt(0).toUpperCase()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{playlist.name}</h1>
              <p className="text-gray-600 mb-4">
                {playlist.description || "No description available"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>{playlist.trackCount || 0} tracks</span>
                <span>•</span>
                <span>Created {new Date(playlist.createdAt).toLocaleDateString()}</span>
              </div>
              
              {/* Play Button */}
              {playlist.tracks && playlist.tracks.length > 0 && (
                <button
                  onClick={handlePlayAll}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <FaPlay className="w-4 h-4" />
                  Play All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tracks</h2>
          </div>
          
          {playlist.tracks && playlist.tracks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {playlist.tracks.map((track: Track, index: number) => (
                <div key={track.id} className="p-4">
                  <TrackCard 
                    track={track} 
                    index={index} 
                    playlist={playlist.tracks}
                    playlistName={playlist.name}
                    showRemoveButton={true}
                    onRemove={() => openRemoveModal(track)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaMusic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks yet</h3>
              <p className="text-gray-600">This playlist is empty. Add some tracks to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Remove Track Confirmation Modal */}
      {trackToRemove && (
        <RemoveTrackModal
          isOpen={!!trackToRemove}
          trackTitle={trackToRemove.title}
          playlistName={playlist?.name || ''}
          onClose={closeRemoveModal}
          onConfirm={confirmRemoveTrack}
        />
      )}
    </div>
  );
};

PlaylistDetail.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default PlaylistDetail;

