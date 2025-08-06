import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { NextPage } from "next";
import Layout from "@components/layout/layout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import dynamic from "next/dynamic";
import ClientOnly from "@components/common/client-only";
import { CreatePlaylistModal } from "@components/music/create-playlist-modal";
import { EditPlaylistModal } from "@components/music/edit-playlist-modal";
import { DeletePlaylistModal } from "@components/music/delete-playlist-modal";
import { PlaylistOptionsMenu } from "@components/music/playlist-options-menu";
import { usePlaylist } from "@contexts/playlist.context";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useUI } from "@contexts/ui.context";
import { useRouter } from "next/router";

import { Track, Album, Artist } from "@contexts/music-player.context";

// Dynamic import of VirtualizedTrackList (client-side only)
const VirtualizedTrackList = dynamic(
  () => import("@components/music/VirtualizedTrackList"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading tracks...</span>
      </div>
    ),
  }
);

const MusicPage: NextPage = () => {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const { playlists, fetchPlaylists } = usePlaylist();
  const { openModal, setModalView, closeModal } = useUI();
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "tracks" | "albums" | "artists" | "playlists"
  >("tracks");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<any>(null);
  const [wasLoggedIn, setWasLoggedIn] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor session changes for automatic redirect after login
  useEffect(() => {
    if (status === "loading") return; // Still loading session

    // If user just logged in successfully, close modal and stay on current page
    if (session && !wasLoggedIn) {
      setWasLoggedIn(true);
      closeModal();
      // Optionally refresh playlists if we're on the playlists tab
      if (activeTab === "playlists") {
        fetchPlaylists();
      }
    } else if (!session && wasLoggedIn) {
      // User logged out
      setWasLoggedIn(false);
    }
  }, [session, status, wasLoggedIn, closeModal, activeTab, fetchPlaylists]);

  // Handle opening login modal
  const handleOpenLoginModal = () => {
    setModalView("LOGIN_VIEW");
    openModal();
  };

  // Fetch tracks, albums, artists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [tracksRes, albumsRes, artistsRes] = await Promise.all([
          fetch("/api/music/tracks"),
          fetch("/api/music/albums"),
          fetch("/api/music/artists"),
        ]);

        if (tracksRes.ok) {
          const tracksData = await tracksRes.json();

          // Handle paginated response format
          const tracks = tracksData.data || tracksData || [];
          setTracks(tracks);
        } else {
          console.error(
            "Tracks API failed:",
            tracksRes.status,
            tracksRes.statusText
          );
        }

        if (albumsRes.ok) {
          const albumsData = await albumsRes.json();
          setAlbums(albumsData || []);
        } else {
          console.error(
            "Albums API failed:",
            albumsRes.status,
            albumsRes.statusText
          );
        }

        if (artistsRes.ok) {
          const artistsData = await artistsRes.json();
          setArtists(artistsData || []);
        } else {
          console.error(
            "Artists API failed:",
            artistsRes.status,
            artistsRes.statusText
          );
        }
      } catch (err) {
        console.error("Music load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  };

  const filteredTracks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const result = searchQuery
      ? tracks.filter(
          (t) =>
            t.title?.toLowerCase().includes(query) ||
            t.artist?.toLowerCase().includes(query)
        )
      : tracks;

    return result;
  }, [tracks, searchQuery]);

  const filteredAlbums = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return searchQuery
      ? albums.filter(
          (a) =>
            a.title?.toLowerCase().includes(query) ||
            a.artist?.toLowerCase().includes(query)
        )
      : albums;
  }, [albums, searchQuery]);

  const filteredArtists = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return searchQuery
      ? artists.filter(
          (a) =>
            a.name?.toLowerCase().includes(query) ||
            a.bio?.toLowerCase().includes(query)
        )
      : artists;
  }, [artists, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sufi Music</h1>
        <p className="text-gray-600 mb-6">
          Discover and play your favorite sufi kalam
        </p>

        {/* Search and Create Playlist */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 sm:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tracks, albums, or artists..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Create Playlist Button */}
          {session && (
            <button
              onClick={() => setShowCreatePlaylistModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              Create Playlist
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-8 sm:gap-0">
            {["tracks", "albums", "artists"].map((tab) => {
              const label = tab.charAt(0).toUpperCase() + tab.slice(1);
              const count =
                tab === "tracks"
                  ? filteredTracks.length
                  : tab === "albums"
                  ? filteredAlbums.length
                  : filteredArtists.length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="block sm:inline">{label}</span>
                  <span className="ml-1 sm:ml-2 text-xs bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}

            {/* My Playlists Tab - Show for all users */}
            <button
              onClick={() => setActiveTab("playlists")}
              className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "playlists"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="block sm:inline">My Playlists</span>
              <span className="ml-1 sm:ml-2 text-xs bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                {session ? playlists.length : 0}
              </span>
            </button>
          </nav>
        </div>

        {/* Tabs Content */}
        <div className="bg-white rounded-lg shadow p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-12">
              <FaSpinner className="animate-spin h-6 w-6 inline text-blue-500 mr-2" />
              Loading...
            </div>
          ) : (
            <>
              {/* Tracks */}
              <div className={activeTab === "tracks" ? "" : "hidden"}>
                {/* Debug info */}

                {filteredTracks.length > 0 ? (
                  <VirtualizedTrackList
                    tracks={filteredTracks}
                    height={600}
                    itemHeight={80}
                    onLoadMore={() => {}}
                    hasNextPage={false}
                    loading={false}
                    playlistName="All Tracks"
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-2">
                      {searchQuery
                        ? "No tracks match your search."
                        : "No tracks available."}
                    </p>
                    {!searchQuery && (
                      <p className="text-gray-400 text-sm">
                        Check if tracks are properly added to the database.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Albums */}
              <div className={activeTab === "albums" ? "" : "hidden"}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {filteredAlbums.map((album) => (
                    <Link key={album.id} href={`/album/${album.id}`}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        {album.coverImageUrl ? (
                          <img
                            src={album.coverImageUrl}
                            alt={album.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <span className="text-gray-400 text-lg">
                              No Cover
                            </span>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {album.title || "Untitled Album"}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {album.artist || "Unknown Artist"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {album.tracks?.length || 0} track
                            {(album.tracks?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Artists */}
              <div className={activeTab === "artists" ? "" : "hidden"}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {filteredArtists.map((artist) => (
                    <Link key={artist.id} href={`/artist/${artist.id}`}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg text-center cursor-pointer">
                        {artist.profileImageUrl ? (
                          <img
                            src={artist.profileImageUrl}
                            alt={artist.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <span className="text-gray-400 text-lg">
                              {(artist.name || "A").charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {artist.name || "Unknown Artist"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {artist.albums?.length || 0} album
                            {(artist.albums?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* My Playlists */}
              <div className={activeTab === "playlists" ? "" : "hidden"}>
                {!session ? (
                  /* Login Prompt for Non-Authenticated Users */
                  <div className="text-center py-8 sm:py-12 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                      Login to Create Your Own Playlists
                    </h3>
                    <p className="text-gray-500 mb-6 text-sm sm:text-base max-w-md mx-auto">
                      Sign in to create personalized playlists and organize your
                      favorite sufi tracks
                    </p>
                    <button
                      onClick={handleOpenLoginModal}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign In to Get Started
                    </button>
                  </div>
                ) : playlists.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {playlists.map((playlist) => (
                      <div key={playlist.id} className="relative">
                        <Link href={`/playlist/${playlist.id}`}>
                          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                            {playlist.cover ? (
                              <img
                                src={playlist.cover}
                                alt={playlist.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-t-lg flex items-center justify-center">
                                <div className="text-center text-white">
                                  <svg
                                    className="w-12 h-12 mx-auto mb-2 opacity-80"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <p className="text-sm font-medium opacity-90">
                                    {playlist.name.charAt(0).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {playlist.name}
                              </h3>
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {playlist.description || "No description"}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {playlist.trackCount || 0} track
                                {(playlist.trackCount || 0) !== 1 ? "s" : ""}
                              </p>
                              <p className="text-xs text-gray-400">
                                Created{" "}
                                {new Date(
                                  playlist.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                        {/* Playlist Options Menu */}
                        <div className="absolute top-2 right-2">
                          <PlaylistOptionsMenu
                            playlist={playlist}
                            onEdit={() => setEditingPlaylist(playlist)}
                            onDelete={() => setDeletingPlaylist(playlist)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* No Playlists for Authenticated Users */
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No playlists yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Create your first playlist to organize your favorite
                      tracks
                    </p>
                    <button
                      onClick={() => setShowCreatePlaylistModal(true)}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Create Your First Playlist
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylistModal && (
        <CreatePlaylistModal
          isOpen={showCreatePlaylistModal}
          onClose={() => setShowCreatePlaylistModal(false)}
          onSuccess={() => {
            setShowCreatePlaylistModal(false);
            fetchPlaylists(); // Refresh playlists after creation
          }}
        />
      )}

      {/* Edit Playlist Modal */}
      {editingPlaylist && (
        <EditPlaylistModal
          isOpen={!!editingPlaylist}
          playlist={editingPlaylist}
          onClose={() => setEditingPlaylist(null)}
          onSuccess={() => {
            setEditingPlaylist(null);
            fetchPlaylists(); // Refresh playlists after update
          }}
        />
      )}

      {/* Delete Playlist Modal */}
      {deletingPlaylist && (
        <DeletePlaylistModal
          isOpen={!!deletingPlaylist}
          playlist={deletingPlaylist}
          onClose={() => setDeletingPlaylist(null)}
          onSuccess={() => {
            setDeletingPlaylist(null);
            fetchPlaylists(); // Refresh playlists after deletion
          }}
        />
      )}
    </div>
  );
};

MusicPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default MusicPage;
