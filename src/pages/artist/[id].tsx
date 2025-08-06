import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TrackCard from "@components/music/track-card";
import { Artist, Track } from "@contexts/music-player.context";
import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa";
import { useMusicPlayer } from "@contexts/music-player.context";
import Link from "next/link";

const ArtistPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "albums" | "tracks">(
    "overview"
  );
  const { state, playTrack, pause, resume } = useMusicPlayer();

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/music/artists/${id}`);
        const artistData = await response.json();

        if (artistData && !artistData.albums) {
          artistData.albums = [];
        }

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
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const getAllTracks = (): Track[] => {
    if (!artist || !artist.albums) return [];
    return artist.albums.flatMap((album) => album.tracks || []);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Artist not found
          </h1>
          <button
            onClick={() => router.push("/music")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Music
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button
          onClick={() => router.push('/music')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Music Library</span>
        </button>

        {/* Artist Header */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
            {artist.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                className="w-48 h-48 rounded-full shadow-lg object-cover"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-400 flex items-center justify-center shadow-lg">
                <span className="text-6xl font-bold text-gray-800">
                  {artist.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                {artist.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center space-x-3 text-gray-600 mb-6">
                <span>{artist.albums?.length || 0} albums</span>
                <span>•</span>
                <span>{allTracks.length} songs</span>
              </div>
              {/* Play Button */}
              {allTracks.length > 0 && (
                <button
                  onClick={handlePlayAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center md:justify-start space-x-2 transition-colors shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                  <span>{isPlaying ? "Pause" : "Play All"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {["overview", "albums", "tracks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "overview" && (
            <div className="p-6">
              {artist.bio && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Albums</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artist.albums.slice(0, 4).map((album) => (
                    <Link key={album.id} href={`/album/${album.id}`}>
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        {album.cover && (
                          <img
                            src={album.cover}
                            alt={album.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {album.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {album.tracks?.length || 0} track
                            {(album.tracks?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {artist.albums.length > 4 && (
                  <button
                    onClick={() => setActiveTab("albums")}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Albums ({artist.albums.length})
                  </button>
                )}
              </div>

              {allTracks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Popular Tracks</h2>
                  <div className="divide-y">
                    {allTracks.slice(0, 5).map((track, index) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        playlist={allTracks}
                        playlistName={`${artist.name} - All Tracks`}
                        index={index}
                      />
                    ))}
                  </div>
                  {allTracks.length > 5 && (
                    <button
                      onClick={() => setActiveTab("tracks")}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Tracks ({allTracks.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "albums" && (
            <div>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Albums</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {artist.albums.map((album) => (
                  <Link key={album.id} href={`/album/${album.id}`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      {album.cover && (
                        <img
                          src={album.cover}
                          alt={album.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {album.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {album.artist}
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
          )}

          {activeTab === "tracks" && (
            <div>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">All Tracks</h2>
              </div>
              <div className="divide-y">
                {allTracks.map((track, index) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    playlist={allTracks}
                    playlistName={`${artist.name} - All Tracks`}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ArtistPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "forms",
        "menu",
        "footer",
      ])),
    },
  };
};

export default ArtistPage;
