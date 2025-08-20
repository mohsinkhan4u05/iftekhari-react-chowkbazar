import React, { useState } from "react";
import { NextPage } from "next";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  usePlaylistsQuery,
  useCreatePlaylistMutation,
} from "../framework/music/get-playlists";
import { useSession } from "next-auth/react";
import CreatePlaylistModal from "@components/music-redesign/create-playlist-modal";
import { FaPlus, FaMusic, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

const MyPlaylistsPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: playlists, isLoading } = usePlaylistsQuery();
  const createPlaylistMutation = useCreatePlaylistMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your playlists.
          </p>
          <Link href="/auth/signin">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Playlists</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your music playlists
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus size={16} />
            <span>Create Playlist</span>
          </button>
        </div>

        {/* Playlists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg w-full aspect-square mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Cover Image */}
                  <div className="aspect-square relative overflow-hidden">
                    {playlist.coverImageUrl ? (
                      <img
                        src={playlist.coverImageUrl}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <FaMusic className="text-white text-3xl opacity-80" />
                      </div>
                    )}
                    {/* Privacy Icon */}
                    <div className="absolute top-2 right-2">
                      {playlist.isPublic ? (
                        <FaEye className="text-white text-sm drop-shadow" />
                      ) : (
                        <FaEyeSlash className="text-white text-sm drop-shadow" />
                      )}
                    </div>
                  </div>

                  {/* Playlist Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaMusic className="mx-auto text-gray-400 text-6xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Playlists Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first playlist to start organizing your music
              collection.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Playlist
            </button>
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

// @ts-ignore
MyPlaylistsPage.Layout = Layout;

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

export default MyPlaylistsPage;
