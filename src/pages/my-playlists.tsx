import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { CreatePlaylistModal } from '@components/music/create-playlist-modal';
import { usePlaylist } from '@contexts/playlist.context';
import { PlusIcon, PlayIcon, TrashIcon, PencilIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { MusicNoteIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const MyPlaylistsPage = () => {
  const { playlists, fetchPlaylists, isLoading, error } = usePlaylist();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePlaylistSuccess = () => {
    fetchPlaylists();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Playlists</h1>
      <button
        onClick={handleOpenModal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create New Playlist
      </button>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCreatePlaylistSuccess}
      />

      {isLoading ? (
        <p>Loading playlists...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <ul className="space-y-4">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="p-4 bg-gray-100 rounded-md shadow">
              <h2 className="text-xl font-semibold">{playlist.name}</h2>
              <p>{playlist.description}</p>
              <div className="text-sm text-gray-600">
                {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPlaylistsPage;

