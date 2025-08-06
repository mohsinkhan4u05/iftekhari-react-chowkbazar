import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import withAdminAuth from "@components/auth/withAdminAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit3, FiTrash2, FiMusic, FiSearch, FiArrowLeft } from "react-icons/fi";

interface Track {
  id: string;
  title: string;
  albumTitle: string;
  duration?: string;
  createdAt: string;
}

function ManageTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch tracks from API
    fetch("/api/tracks")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTracks(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tracks:", error);
        setTracks([]);
        setLoading(false);
      });
  }, []);

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.albumTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return;

    try {
      const res = await fetch(`/api/tracks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTracks((tracks) => tracks.filter((track) => track.id !== id));
      } else {
        alert("Failed to delete track");
      }
    } catch (error) {
      alert("Failed to delete track");
    }
  };

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
              Track Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and manage music tracks
            </p>
          </div>

          <Link
            href="/admin/tracks/create"
            className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium mt-4 md:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            Create New Track
          </Link>
        </div>

        {/* Statistics Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FiMusic className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tracks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tracks.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredTracks.length} track
            {filteredTracks.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Tracks List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-12">
              <FiMusic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tracks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {tracks.length === 0
                  ? "Start by creating your first track."
                  : "Try adjusting your search criteria."}
              </p>
              {tracks.length === 0 && (
                <Link
                  href="/admin/tracks/create"
                  className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Create First Track
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">
                      Track
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">
                      Album
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white hidden sm:table-cell">
                      Duration
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredTracks.map((track) => (
                    <tr
                      key={track.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {track.title}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-600 dark:text-gray-400 font-medium">
                          {track.albumTitle}
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell">
                        <div className="text-gray-600 dark:text-gray-400">
                          {track.duration || "—"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/tracks/edit/${track.id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Edit Track"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(track.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                            title="Delete Track"
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

ManageTracks.Layout = Layout;
export default withAdminAuth(ManageTracks);
