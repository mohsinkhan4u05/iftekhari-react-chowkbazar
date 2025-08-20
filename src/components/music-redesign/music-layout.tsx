import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUI } from "@contexts/ui.context";
import { usePlaylist } from "@contexts/playlist.context";
import { useRouter } from "next/router";
import Link from "next/link";
import UserAvatar from "@components/ui/UserAvatar";
import CreatePlaylistModal from "./create-playlist-modal";
import MobileSearchOverlay from "./mobile-search-overlay";
import { FaHome, FaUser } from "react-icons/fa";
import { useMusicPlayer } from "@contexts/music-player.context";
import SearchOverlay from "./SearchOverlay"; // ✅ Import overlay

const MusicLayout = ({ children }: { children: React.ReactNode }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  console.log("showSearchOverlay : ", showSearchOverlay);
  // ✅ Desktop overlay state
  const { data: session } = useSession();
  const { openModal, setModalView } = useUI();
  const { playlists } = usePlaylist();
  const { state } = useMusicPlayer();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    setModalView("LOGIN_VIEW");
    openModal();
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-8 py-3 bg-opacity-80 backdrop-blur-md border-b border-gray-800 shadow-lg w-full">
        <div className="flex w-full items-center gap-2 sm:gap-4">
          {/* Home Icon on larger screens */}
          <div className="hidden sm:flex items-center">
            <Link href="/" legacyBehavior>
              <a className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <FaHome className="text-white text-xl" />
              </a>
            </Link>
          </div>
          {/* Iftekhari Silsila Title (desktop only) */}
          <div className="hidden sm:flex items-center ml-4">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-gray-100 bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-purple-500 text-transparent drop-shadow-lg select-none">
              IFTEKHARI SILSILA
            </span>
          </div>
          {/* Search bar + user login */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
              {/* ✅ Trigger overlay search */}
              <button
                onClick={() => setShowSearchOverlay(true)}
                className="w-full flex items-center bg-gray-800 hover:bg-gray-700 text-white rounded-full px-4 py-2 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 gap-2"
                aria-label="Open search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  />
                </svg>
                <span className="text-gray-400 font-medium text-sm block sm:hidden">
                  Search
                </span>
                <span className="text-gray-400 font-medium text-sm hidden sm:block">
                  Search music, artists, albums...
                </span>
              </button>
            </div>
            {session ? (
              <UserAvatar
                name={session.user?.name || "User"}
                image={session.user?.image}
                size="sm"
                className="flex-shrink-0 ml-2"
              />
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-white text-black px-3 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors ml-2"
              >
                <FaUser />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start w-full px-2 md:px-8 py-6">
        <div className="w-full">{children}</div>
      </main>

      {/* Mobile Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden flex flex-col">
        {/* Music Player Bar */}
        {typeof MusicPlayerBar !== "undefined" && (
          <div className="bg-gray-900 border-t border-gray-800">
            <MusicPlayerBar />
          </div>
        )}
        {/* Bottom Navigation */}
        <nav
          className="bg-black bg-opacity-95 border-t border-gray-800 flex justify-between items-center px-2 py-1"
          style={{
            boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
            pointerEvents: "auto",
          }}
        >
          {/* ... existing nav buttons ... */}
        </nav>
      </div>

      {/* Modals */}
      {showMobileSearch && (
        <MobileSearchOverlay onClose={() => setShowMobileSearch(false)} />
      )}
      {showCreateModal && (
        <CreatePlaylistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center md:hidden">
          {/* ... existing library modal ... */}
        </div>
      )}

      {/* ✅ Desktop Search Overlay */}
      {showSearchOverlay && (
        <SearchOverlay
          isOpen={showSearchOverlay}
          onClose={() => setShowSearchOverlay(false)}
        />
      )}
    </div>
  );
};

export default MusicLayout;
