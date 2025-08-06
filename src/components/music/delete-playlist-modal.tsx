import React, { useState } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePlaylist } from '@contexts/playlist.context';
import { ToastNotification } from '@components/ui/toast-notification';

interface DeletePlaylistModalProps {
  isOpen: boolean;
  playlist: {
    id: string;
    name: string;
    trackCount?: number;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeletePlaylistModal: React.FC<DeletePlaylistModalProps> = ({
  isOpen,
  playlist,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { deletePlaylist, error } = usePlaylist();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const success = await deletePlaylist(playlist.id);
      
      if (success) {
        setShowSuccessToast(true);
        
        // Close modal after showing toast
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error deleting playlist:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Delete Playlist
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the playlist <span className="font-semibold">"{playlist.name}"</span>?
          </p>
          
          {playlist.trackCount !== undefined && playlist.trackCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This playlist contains {playlist.trackCount} track{playlist.trackCount !== 1 ? 's' : ''}. 
                This action cannot be undone.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Deleting...
                </div>
              ) : (
                'Delete Playlist'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <ToastNotification
          type="success"
          title="Playlist Deleted!"
          message={`"${playlist.name}" has been deleted successfully.`}
          onClose={() => setShowSuccessToast(false)}
          duration={2000}
        />
      )}
    </div>
  );
};
