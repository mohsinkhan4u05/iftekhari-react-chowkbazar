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
  bio?: string;
  profileImageUrl?: string;
}

function EditArtist() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [artistLoading, setArtistLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    bio: "",
    profileImageUrl: "",
  });

  // Fetch artist details
  useEffect(() => {
    if (id && typeof id === "string") {
      fetch(`/api/artists/${id}`)
        .then((res) => res.json())
        .then((data: Artist) => {
          setFormData({
            name: data.name || "",
            genre: data.genre || "",
            bio: data.bio || "",
            profileImageUrl: data.profileImageUrl || "",
          });
          setArtistLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching artist:", error);
          alert("Failed to load artist details");
          setArtistLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/artists");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update artist");
      }
    } catch (error) {
      console.error("Error updating artist:", error);
      alert("Failed to update artist");
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (artistLoading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/artists"
            className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Artists
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Artist
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Artist Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Artist Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            {/* Genre */}
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Primary Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a genre</option>
                <option value="Rock">Rock</option>
                <option value="Pop">Pop</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="R&B">R&B</option>
                <option value="Country">Country</option>
                <option value="Electronic">Electronic</option>
                <option value="Folk">Folk</option>
                <option value="Blues">Blues</option>
                <option value="Reggae">Reggae</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Biography
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Artist Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Artist Image
              </label>
              <CoverImageUploader
                onUploadComplete={(url) =>
                  setFormData((prev) => ({ ...prev, profileImageUrl: url }))
                }
                currentImage={formData.profileImageUrl}
                onRemove={() =>
                  setFormData((prev) => ({ ...prev, profileImageUrl: "" }))
                }
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                {loading ? "Updating..." : "Update Artist"}
              </button>
              <Link
                href="/admin/artists"
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

EditArtist.Layout = Layout;
export default withAdminAuth(EditArtist);
