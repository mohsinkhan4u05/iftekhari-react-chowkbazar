import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import withAdminAuth from "@components/auth/withAdminAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiMic,
  FiCalendar,
  FiGlobe,
  FiSearch,
  FiFilter,
  FiArrowLeft,
} from "react-icons/fi";

interface Artist {
  id: string;
  name: string;
  genre: string;
  profileImageUrl?: string;
  createdAt: string;
}

function ManageArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("");

  useEffect(() => {
    // Fetch artists from API
    fetch("/api/artists")
      .then((res) => res.json())
      .then((data) => {
        setArtists(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "" || artist.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;

    try {
      const res = await fetch(`/api/artists/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArtists(artists.filter((artist) => artist.id !== id));
      } else {
        alert("Failed to delete artist");
      }
    } catch (error) {
      alert("Failed to delete artist");
    }
  };

  const uniqueGenres = [
    ...new Set(artists.map((artist) => artist.genre)),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Back to Music Link */}
        <div className="mb-6">
          <Link
            href="/music"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-accent transition-colors group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Music Library</span>
          </Link>
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Artist Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and manage music artists
            </p>
          </div>

          <Link
            href="/admin/artists/create"
            className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium mt-4 md:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            Create New Artist
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FiMic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Artists
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {artists.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FiGlobe className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Genres
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {uniqueGenres.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    artists.filter((artist) => {
                      const artistDate = new Date(artist.createdAt);
                      const now = new Date();
                      return (
                        artistDate.getMonth() === now.getMonth() &&
                        artistDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[150px]"
              >
                <option value="">All Genres</option>
                {uniqueGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredArtists.length} artist
            {filteredArtists.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Artists List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {filteredArtists.length === 0 ? (
            <div className="text-center py-12">
              <FiMic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No artists found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {artists.length === 0
                  ? "Start by creating your first artist."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {artists.length === 0 && (
                <Link
                  href="/admin/artists/create"
                  className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Create First Artist
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">
                      Artist
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">
                      Genre
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredArtists.map((artist) => (
                    <tr
                      key={artist.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gradient-to-br from-gray-400 to-gray-600">
                            {artist.profileImageUrl ? (
                              <img
                                src={artist.profileImageUrl}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  if (target.nextElementSibling) {
                                    (
                                      target.nextElementSibling as HTMLElement
                                    ).style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full flex items-center justify-center text-white font-bold text-lg ${
                                artist.profileImageUrl ? "hidden" : "flex"
                              }`}
                              style={{
                                display: artist.profileImageUrl
                                  ? "none"
                                  : "flex",
                              }}
                            >
                              {artist.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {artist.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm">
                          {artist.genre}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/artists/edit/${artist.id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Edit Artist"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(artist.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Delete Artist"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

ManageArtists.Layout = Layout;
export default withAdminAuth(ManageArtists);
