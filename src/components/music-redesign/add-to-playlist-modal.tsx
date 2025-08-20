import React, { useState } from "react";
import { ToastNotification } from "@components/ui/toast-notification";
import { FaTimes, FaPlus, FaMusic, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  usePlaylistsQuery,
  useAddTrackToPlaylistMutation,
  useCreatePlaylistMutation,
} from "../../framework/music/get-playlists";
import { useSession } from "next-auth/react";
import CreatePlaylistModal from "./create-playlist-modal";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
  trackArtist: string;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  trackId,
  trackTitle,
  trackArtist,
}) => {
  console.log("DEBUG: AddToPlaylistModal rendered", {
    trackId,
    trackTitle,
    trackArtist,
  });
  const { data: session } = useSession();
  const { data: playlists, isLoading } = usePlaylistsQuery();
  const addTrackMutation = useAddTrackToPlaylistMutation();
  const createPlaylistMutation = useCreatePlaylistMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [toast, setToast] = useState<null | {
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  }>(null);

  if (!isOpen) return null;

  if (!session?.user?.email) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-4">
              You need to be logged in to add tracks to playlists.
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!playlistId) return;

    setIsSubmitting(true);
    try {
      const result = await addTrackMutation.mutateAsync({
        playlistId,
        trackId,
      });

      if (result.alreadyExists) {
        setToast({
          type: "info",
          title: "Track Already Exists",
          message: "This track is already in the selected playlist.",
        });
      } else {
        setToast({
          type: "success",
          title: "Track Added",
          message: "Track added to playlist successfully!",
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (error: any) {
      const errorMsg = error?.message || "";
      if (errorMsg.includes("Track already exists in playlist")) {
        setToast({
          type: "info",
          title: "Track Already Exists",
          message: "This track is already in the selected playlist.",
        });
      } else {
        setToast({
          type: "error",
          title: "Error",
          message: "Failed to add track to playlist. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePlaylist = async (playlistData: any) => {
    try {
      const newPlaylist = await createPlaylistMutation.mutateAsync(
        playlistData
      );
      setShowCreateModal(false);

      // Add the track to the newly created playlist
      await addTrackMutation.mutateAsync({
        playlistId: newPlaylist.id,
        trackId,
      });

      setToast({
        type: "success",
        title: "Playlist Created",
        message: "Playlist created and track added successfully!",
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to create playlist. Please try again.",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Add to Playlist
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Track Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaMusic className="text-gray-400 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{trackTitle}</h3>
                <p className="text-sm text-gray-500">{trackArtist}</p>
              </div>
            </div>
          </div>

          {/* Playlists List */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Your Playlists
              </h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <FaPlus size={12} />
                <span>New Playlist</span>
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : playlists && playlists.length > 0 ? (
              <div className="space-y-3">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={isSubmitting}
                    className="w-full flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {playlist.coverImageUrl ? (
                        <img
                          src={playlist.coverImageUrl}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaMusic className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {playlist.name}
                        </h4>
                        {playlist.isPublic ? (
                          <FaEye className="text-gray-400" size={12} />
                        ) : (
                          <FaEyeSlash className="text-gray-400" size={12} />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {playlist.totalTracks} tracks •{" "}
                        {formatDuration(playlist.totalDuration)}
                      </p>
                      {playlist.description && (
                        <p className="text-xs text-gray-400 truncate">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaMusic className="mx-auto text-gray-400 text-3xl mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Playlists Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first playlist to start organizing your music.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreatePlaylist}
        />
      )}
    </>
  );
};

export default AddToPlaylistModal;
