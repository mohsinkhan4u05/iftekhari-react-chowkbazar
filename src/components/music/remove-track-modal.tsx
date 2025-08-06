import React, { useState } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaMusic } from 'react-icons/fa';

interface RemoveTrackModalProps {
  isOpen: boolean;
  trackTitle: string;
  playlistName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const RemoveTrackModal: React.FC<RemoveTrackModalProps> = ({
  isOpen,
  trackTitle,
  playlistName,
  onClose,
  onConfirm,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirm = async () => {
    setIsRemoving(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error removing track:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FaMusic className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Remove Track
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isRemoving}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to remove <span className="font-semibold">"{trackTitle}"</span> from the playlist <span className="font-semibold">"{playlistName}"</span>?
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The track will only be removed from this playlist. It will still be available in your music library and other playlists.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRemoving}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isRemoving}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRemoving ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Removing...
                </div>
              ) : (
                'Remove Track'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
