import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TrackCard from "@components/music/track-card";
import { Album } from "@contexts/music-player.context";
import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa";
import { useMusicPlayer } from "@contexts/music-player.context";

const AlbumPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [album, setAlbum] = useState<Album | null>(null);
  console.log("Album detail:", album);
  const [loading, setLoading] = useState(true);
  const { state, playTrack, pause, resume } = useMusicPlayer();

  useEffect(() => {
    if (!id) return;

    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/music/albums/${id}`);
        const albumData = await response.json();

        // Ensure tracks is always an array
        if (albumData && !albumData.tracks) {
          albumData.tracks = [];
        }

        // Optional: Normalize track data (helpful for frontend consistency)
        albumData.tracks = albumData.tracks.map((track: any) => ({
          ...track,
          coverImage: track.coverImage || track.cover,
          audioUrl: track.audioUrl || track.url,
        }));

        setAlbum(albumData);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const handlePlayAll = () => {
    if (!album?.tracks?.length) return;

    const isPlayingThisAlbum = state.currentPlaylistName === album.title;
    const isPlaying = state.isPlaying && isPlayingThisAlbum;

    if (isPlayingThisAlbum) {
      isPlaying ? pause() : resume();
    } else {
      playTrack(album.tracks[0], album.tracks, album.title);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Album not found
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

  const isPlayingThisAlbum = state.currentPlaylistName === album.title;
  const isPlaying = state.isPlaying && isPlayingThisAlbum;

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

        {/* Album Header */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
            {album?.coverImageUrl ? (
              <img
                src={album?.coverImageUrl}
                alt={album.title}
                className="w-48 h-48 rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-48 h-48 rounded-lg bg-gray-400 flex items-center justify-center shadow-lg">
                <span className="text-6xl font-bold text-gray-800">
                  {album?.title?.charAt(0) || "A"}
                </span>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                {album.title}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center space-x-3 text-gray-600 mb-6">
                <span>{album.artist}</span>
                <span>•</span>
                <span>{new Date(album.releaseDate).getFullYear()}</span>
                <span>•</span>
                <span>{album.tracks?.length || 0} songs</span>
                {album.genre && (
                  <>
                    <span>•</span>
                    <span>{album.genre}</span>
                  </>
                )}
              </div>
              {/* Play Button */}
              {album.tracks.length > 0 && (
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

        {/* Track List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200">Tracks</h2>
          <div className="divide-y divide-gray-100">
            {album.tracks.length > 0 ? (
              album.tracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playlist={album.tracks}
                  playlistName={album.title}
                  index={index}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No tracks found for this album.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AlbumPage.Layout = Layout;

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

export default AlbumPage;
