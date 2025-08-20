import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import withAdminAuth from "@components/auth/withAdminAuth";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { CoverImageUploader } from "@components/ui/CoverImageUploader";

interface Artist {
  id: string;
  name: string;
  genre: string;
}

function CreateAlbum() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    releaseDate: "",
    genre: "",
    description: "",
    coverImageUrl: "", // <-- new field for album cover
  });

  useEffect(() => {
    // Fetch artists for dropdown
    fetch("/api/artists")
      .then((res) => res.json())
      .then((data) => setArtists(data || []))
      .catch((error) => {
        console.error("Error fetching artists:", error);
        setArtists([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/albums");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create album");
      }
    } catch (error) {
      console.error("Error creating album:", error);
      alert("Failed to create album");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/albums"
            className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Album
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Album Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Album Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                placeholder="Enter album title"
              />
            </div>

            {/* Artist Selection */}
            <div>
              <label
                htmlFor="artist"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Artist *
              </label>
              <select
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select an artist</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Album Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                placeholder="Album description..."
              />
            </div>

            {/* Album Cover Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Album Cover
              </label>
              <CoverImageUploader
                onUploadComplete={(url) => {
                  setFormData((prev) => ({ ...prev, coverImageUrl: url }));
                }}
                currentImage={formData.coverImageUrl}
                onRemove={() => {
                  setFormData((prev) => ({ ...prev, coverImageUrl: "" }));
                }}
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-4 h-4" />
                {loading ? "Creating..." : "Create Album"}
              </button>

              <Link
                href="/admin/albums"
                className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}

CreateAlbum.Layout = Layout;
export default withAdminAuth(CreateAlbum);
