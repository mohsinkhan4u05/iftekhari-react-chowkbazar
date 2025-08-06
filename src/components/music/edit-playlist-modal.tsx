import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePlaylist } from '@contexts/playlist.context';
import { ToastNotification } from '@components/ui/toast-notification';

interface EditPlaylistModalProps {
  isOpen: boolean;
  playlist: {
    id: string;
    name: string;
    description?: string;
  };
  onClose: () => void;
  onSuccess?: (updated: any) => void;
}

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  playlist,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { updatePlaylist, error } = usePlaylist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    setIsSubmitting(true);
    
    try {
      const success = await updatePlaylist(playlist.id, name.trim(), description.trim());
      
      if (success) {
        setShowSuccessToast(true);
        
        // Close modal after showing toast
        setTimeout(() => {
          onSuccess?.({
            ...playlist,
            name,
            description,
          });
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating playlist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName(playlist.name);
      setDescription(playlist.description || '');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Playlist
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Playlist Name */}
          <div>
            <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700 mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              id="playlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter playlist name"
              required
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="playlistDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="playlistDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter playlist description"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Success Toast */}
      {showSuccessToast && (
        <ToastNotification
          type="success"
          title="Playlist Updated!"
          message={`"${name}" has been updated successfully.`}
          onClose={() => setShowSuccessToast(false)}
          duration={2000}
        />
      )}
    </div>
  );
};

