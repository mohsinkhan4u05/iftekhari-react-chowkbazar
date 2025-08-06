import React, { useState, useCallback } from 'react';
import { FiMusic, FiX, FiUpload } from 'react-icons/fi';

interface AudioUploaderProps {
  onUploadComplete: (url: string) => void;
  currentAudio?: string;
  onRemove?: () => void;
  className?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onUploadComplete,
  currentAudio,
  onRemove,
  className = "",
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      const audioUrl = result.url;
      if (audioUrl) {
        onUploadComplete(audioUrl);
      } else {
        throw new Error('No audio URL returned from upload');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        await uploadFile(file);
      } else {
        alert('Please select an audio file (MP3, WAV, etc.)');
      }
    }
  }, []);

  if (currentAudio) {
    return (
      <div className={`relative ${className}`}>
        <audio controls className="w-full">
          <source src={currentAudio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${className}`}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => handleFileChange(e as any);
        input.click();
      }}
    >
      {isUploading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">
            Uploading audio...
          </p>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">
            {uploadProgress}%
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <FiMusic className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600">
            Click to upload audio
          </p>
          <p className="text-sm text-gray-500">
            Supports: MP3, WAV (max 16MB)
          </p>
        </div>
      )}
    </div>
  );
};

