import React, { useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { usePlaylistQuery, useUpdatePlaylistMutation, useDeletePlaylistMutation, useRemoveTrackFromPlaylistMutation } from "../../framework/music/get-playlists";
import { useMusicPlayer } from "@contexts/music-player.context";
import { useSession } from "next-auth/react";
import TrackCard from "@components/music/track-card";
import { FaPlay, FaPause, FaArrowLeft, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

const PlaylistPage: NextPage = () => {
  const router = useRouter();
  const { id: playlistId } = router.query;
  const { data: session } = useSession();
  const { state, playTrack, pause, resume } = useMusicPlayer();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: playlist, isLoading, error } = usePlaylistQuery(
    playlistId as string,
    !!playlistId
  );

  const updatePlaylistMutation = useUpdatePlaylistMutation();
  const deletePlaylistMutation = useDeletePlaylistMutation();
  const removeTrackMutation = useRemoveTrackFromPlaylistMutation();

  const handlePlayAll = () => {
    if (!playlist?.tracks?.length) return;

    const isPlayingThisPlaylist = state.currentPlaylistName === playlist.name;
    const isPlaying = state.isPlaying && isPlayingThisPlaylist;

    if (isPlayingThisPlaylist) {
      isPlaying ? pause() : resume();
    } else {
      playTrack(playlist.tracks[0], playlist.tracks, playlist.name);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist || !confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await deletePlaylistMutation.mutateAsync(playlist.id);
      router.push("/my-playlists");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist. Please try again.");
    }
  };

  const handleRemoveTrack = async (trackId: string) => {
    if (!playlist) return;

    try {
      await removeTrackMutation.mutateAsync({
        playlistId: playlist.id,
        trackId,
      });
    } catch (error) {
      console.error("Error removing track:", error);
      alert("Failed to remove track. Please try again.");
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Playlist not found
          </h1>
          <button
            onClick={() => router.push("/my-playlists")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  const isPlayingThisPlaylist = state.currentPlaylistName === playlist.name;
  const isPlaying = state.isPlaying && isPlayingThisPlaylist;
  const isOwner = session?.user?.email === playlist.userId;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => router.push('/my-playlists')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Playlists</span>
        </button>

        {/* Playlist Header */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
            {playlist?.coverImageUrl ? (
              <img
                src={playlist.coverImageUrl}
                alt={playlist.name}
                className="w-48 h-48 rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-48 h-48 rounded-lg bg-gray-400 flex items-center justify-center shadow-lg">
                <span className="text-6xl font-bold text-gray-800">
                  {playlist?.name?.charAt(0) || "P"}
                </span>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  {playlist.name}
                </h1>
                {playlist.isPublic ? (
                  <FaEye className="text-gray-500" size={20} />
                ) : (
                  <FaEyeSlash className="text-gray-500" size={20} />
                )}
              </div>
              {playlist.description && (
                <p className="text-gray-600 mb-4 max-w-md">
                  {playlist.description}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start items-center space-x-3 text-gray-600 mb-6">
                <span>{playlist.totalTracks} songs</span>
                <span>•</span>
                <span>{formatDuration(playlist.totalDuration)}</span>
                <span>•</span>
                <span>{new Date(playlist.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Play Button */}
                {playlist.tracks.length > 0 && (
                  <button
                    onClick={handlePlayAll}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                  >
                    {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                    <span>{isPlaying ? "Pause" : "Play All"}</span>
                  </button>
                )}
                
                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={handleDeletePlaylist}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200">Tracks</h2>
          <div className="divide-y divide-gray-100">
            {playlist.tracks.length > 0 ? (
              playlist.tracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlist={playlist.tracks}
                  playlistName={playlist.name}
                  index={index}
                  showRemoveButton={isOwner}
                  onRemove={() => handleRemoveTrack(track.id)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No tracks in this playlist yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// @ts-ignore
PlaylistPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};

export default PlaylistPage;

