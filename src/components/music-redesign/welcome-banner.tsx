import React from "react";
import { FaMusic, FaHeart, FaPlay, FaPlus } from "react-icons/fa";

interface WelcomeBannerProps {
  onCreatePlaylist: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onCreatePlaylist }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <FaMusic className="text-6xl mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Music</h1>
          <p className="text-xl opacity-90 mb-8">
            Create playlists, discover new music, and enjoy your favorite tracks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <FaPlay className="text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Play Music</h3>
            <p className="text-sm opacity-80">
              Start playing your favorite tracks and discover new music
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <FaHeart className="text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Save Favorites</h3>
            <p className="text-sm opacity-80">
              Like and save your favorite songs to your library
            </p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
            <FaPlus className="text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Create Playlists</h3>
            <p className="text-sm opacity-80">
              Organize your music into custom playlists
            </p>
          </div>
        </div>

        <button
          onClick={onCreatePlaylist}
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
        >
          Create Your First Playlist
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
