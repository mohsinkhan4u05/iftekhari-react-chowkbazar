import React, { useState } from "react";

interface BunnyImageUploaderProps {
  currentImage?: string;
  onUploadComplete: (url: string) => void;
  onRemove: () => void;
  className?: string;
}

export const BunnyImageUploader: React.FC<BunnyImageUploaderProps> = ({
  currentImage,
  onUploadComplete,
  onRemove,
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onUploadComplete(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {currentImage ? (
        <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Cover"
            className="object-cover w-full h-full"
          />
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
};
