import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaMusic } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
  trackTitle?: string;
  playlistName?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  title,
  message,
  duration = 4000,
  onClose,
  trackTitle,
  playlistName,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationCircleIcon className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <FaMusic className="w-6 h-6 text-blue-600" />;
      default:
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-green-800';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`min-w-80 max-w-md rounded-lg border shadow-lg ${getBgColor()}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${getTextColor()}`}>
                {title}
              </h3>
              <div className={`mt-1 text-sm ${getTextColor()}`}>
                <p>{message}</p>
                {trackTitle && playlistName && (
                  <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border">
                    <p className="text-xs font-medium">Track: {trackTitle}</p>
                    <p className="text-xs">Playlist: {playlistName}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'success' 
                    ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                    : type === 'error'
                    ? 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                    : type === 'warning'
                    ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                    : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
