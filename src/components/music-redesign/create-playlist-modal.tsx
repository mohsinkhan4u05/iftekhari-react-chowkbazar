import React, { useState, useRef } from "react";
import { FaTimes, FaUpload, FaEye, FaEyeSlash, FaMusic } from "react-icons/fa";
import { useCreatePlaylistMutation } from "../../framework/music/get-playlists";
import { useSession } from "next-auth/react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (playlistData: any) => void;
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const createPlaylistMutation = useCreatePlaylistMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImageUrl: "",
    isPublic: true,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    if (!session?.user?.email) {
      alert("You must be logged in to create a playlist");
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImageUrl = formData.coverImageUrl;

      // If there's a file, upload it first
      if (coverImage) {
        const formDataFile = new FormData();
        formDataFile.append("file", coverImage);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataFile,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          coverImageUrl = uploadResult.url;
        }
      }

      const newPlaylist = await createPlaylistMutation.mutateAsync({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        coverImageUrl: coverImageUrl || undefined,
        isPublic: formData.isPublic,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        coverImageUrl: "",
        isPublic: true,
      });
      setCoverImage(null);
      setCoverPreview("");

      onSuccess?.(newPlaylist);
      onClose();
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        description: "",
        coverImageUrl: "",
        isPublic: true,
      });
      setCoverImage(null);
      setCoverPreview("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Playlist
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cover Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaMusic className="text-gray-400 text-2xl" />
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaUpload size={14} />
                  <span>Upload Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Playlist Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Playlist Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter playlist name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your playlist..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Privacy Setting */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Public Playlist
              </span>
              {formData.isPublic ? (
                <FaEye className="text-gray-400" size={14} />
              ) : (
                <FaEyeSlash className="text-gray-400" size={14} />
              )}
            </label>
            <p className="text-xs text-gray-500">
              {formData.isPublic
                ? "Anyone can see and listen to this playlist"
                : "Only you can see this playlist"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
