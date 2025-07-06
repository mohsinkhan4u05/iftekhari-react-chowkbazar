import React, { useState, useCallback } from 'react';
import { FiCamera, FiX, FiUpload, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

interface CoverImageUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  className?: string;
}

export const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  onUploadComplete,
  currentImage,
  onRemove,
  className = "",
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload via UploadThing cloud storage
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Get the URL from the response
      const fileUrl = result.url || result.fileUrl || result[0]?.url;
      if (fileUrl) {
        onUploadComplete(fileUrl);
      } else {
        throw new Error('No file URL returned from upload');
      }

      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Validate file type
      if (file.type.startsWith('image/')) {
        await uploadFile(file);
      } else {
        alert('Please select an image file (JPG, PNG, GIF)');
      }
    }
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Filter for image files only
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        await uploadFile(imageFiles[0]); // Upload first image only
      } else {
        alert('Please drop an image file (JPG, PNG, GIF)');
      }
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  if (currentImage) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative h-48 rounded-xl overflow-hidden group">
          <Image
            src={currentImage}
            alt="Cover preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FiUpload className="w-4 h-4" />
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => handleFileChange(e as any);
          input.click();
        }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Uploading image...
            </p>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {uploadProgress}%
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FiCamera className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {isDragActive
                ? "Drop the image here"
                : "Drag and drop an image here, or click to select"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports: JPG, PNG, GIF (max 4MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
