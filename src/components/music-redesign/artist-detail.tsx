import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMusicPlayer } from "@contexts/music-player.context";
import VirtualizedTrackList from "./virtualized-track-list";
import AlbumCard from "./album-card";
import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa";

interface ArtistAlbum {
  id: string;
  title: string;
  artist: string;
  coverImageUrl?: string;
  releaseDate?: string;
  tracks: any[];
}

interface ArtistDetailProps {
  artistId: string;
}

const ArtistDetail: React.FC<ArtistDetailProps> = ({ artistId }) => {
  const router = useRouter();
  const { state, playTrack, pause, resume } = useMusicPlayer();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "albums" | "tracks">(
    "overview"
  );

  useEffect(() => {
    if (!artistId) return;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/music/artists/${artistId}`);
        console.log("Fetching artist data for ID:", response);

        if (!response.ok) {
          throw new Error("Failed to fetch artist");
        }

        const artistData = await response.json();

        // Map DB-specific fields
        artistData.image = artistData.image || artistData.profileImageUrl;
        artistData.albums = artistData.albums.map((album: any) => ({
          ...album,
          cover: album.cover || album.coverImageUrl,
          tracks: (album.tracks || []).map((track: any) => ({
            ...track,
            coverImage: track.coverImage || track.cover,
            audioUrl: track.audioUrl || track.url,
          })),
        }));

        setArtist(artistData);
      } catch (err) {
        console.error("Error fetching artist:", err);
        setError("Failed to load artist details");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  const getAllTracks = () => {
    if (!artist || !artist.tracks) return [];
    return artist.tracks.flatMap((item: any) => item || []);
  };

  const handlePlayAll = () => {
    const allTracks = getAllTracks();
    if (allTracks.length === 0) return;

    const isPlayingThisArtist =
      state.currentPlaylistName === `${artist?.name} - All Tracks`;
    const isPlaying = state.isPlaying && isPlayingThisArtist;

    if (isPlayingThisArtist) {
      isPlaying ? pause() : resume();
    } else {
      playTrack(allTracks[0], allTracks, `${artist?.name} - All Tracks`);
    }
  };

  const handleBack = () => {
    router.push("/music");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Artist Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The artist you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const allTracks = getAllTracks();
  const isPlayingThisArtist =
    state.currentPlaylistName === `${artist.name} - All Tracks`;
  const isPlaying = state.isPlaying && isPlayingThisArtist;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {/* Back Button */}
      <div className="p-4 md:p-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Artist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end px-6 pb-6">
        {artist.image ? (
          <div className="w-64 h-64 md:w-80 md:h-80 shadow-2xl mb-6 md:mb-0 md:mr-8">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        ) : (
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full shadow-2xl mb-6 md:mb-0 md:mr-8 flex items-center justify-center">
            <span className="text-6xl font-bold text-white opacity-50">
              {artist.name?.charAt(0) || "A"}
            </span>
          </div>
        )}

        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
            Artist
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{artist.name}</h1>
          <div className="flex flex-col md:flex-row md:items-center text-gray-300 mb-6">
            <span className="mb-2 md:mb-0 md:mr-4">
              {artist.albums?.length || 0} albums
            </span>
            <span className="hidden md:block">•</span>
            <span className="md:ml-4">{allTracks.length} songs</span>
          </div>
          {allTracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="bg-green-500 hover:bg-green-400 text-black font-bold rounded-full w-14 h-14 flex items-center justify-center transition-colors shadow-lg hover:scale-105"
            >
              {isPlaying ? (
                <FaPause size={24} />
              ) : (
                <FaPlay size={24} className="ml-1" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="border-b border-gray-800">
          <nav className="flex space-x-8">
            {["overview", "albums", "tracks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        {activeTab === "overview" && (
          <div className="mt-6">
            {artist.bio && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed max-w-3xl">
                  {artist.bio}
                </p>
              </div>
            )}

            {artist.albums && artist.albums.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Albums</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {artist.albums.slice(0, 6).map((album: any) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
                {artist.albums.length > 6 && (
                  <button
                    onClick={() => setActiveTab("albums")}
                    className="mt-4 text-gray-400 hover:text-white font-medium"
                  >
                    See all albums
                  </button>
                )}
              </div>
            )}

            {allTracks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
                <div className="bg-black bg-opacity-30 rounded-lg">
                  <div className="border-b border-gray-800 px-4 py-2 hidden md:grid grid-cols-12 text-gray-400 text-sm">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-4">Album</div>
                    <div className="col-span-2 text-right">Duration</div>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
                    <VirtualizedTrackList
                      tracks={allTracks.slice(0, 5)}
                      hasNextPage={false}
                      loading={false}
                      onLoadMore={() => {}}
                      playlistName={`${artist.name} - All Tracks`}
                      height={Math.min(280, 5 * 56)}
                      itemHeight={56}
                    />
                  </div>
                </div>
                {allTracks.length > 5 && (
                  <button
                    onClick={() => setActiveTab("tracks")}
                    className="mt-4 text-gray-400 hover:text-white font-medium"
                  >
                    See all tracks
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "albums" && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6">All Albums</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {artist.albums.map((album: any) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "tracks" && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">All Tracks</h2>
            <div className="bg-black bg-opacity-30 rounded-lg">
              <div className="border-b border-gray-800 px-4 py-2 hidden md:grid grid-cols-12 text-gray-400 text-sm">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-4">Album</div>
                <div className="col-span-2 text-right">Duration</div>
              </div>
              <div className="max-h-[500px] overflow-y-auto overflow-x-hidden">
                <VirtualizedTrackList
                  tracks={allTracks}
                  hasNextPage={false}
                  loading={false}
                  onLoadMore={() => {}}
                  playlistName={`${artist.name} - All Tracks`}
                  height={Math.min(500, allTracks.length * 56)}
                  itemHeight={56}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
