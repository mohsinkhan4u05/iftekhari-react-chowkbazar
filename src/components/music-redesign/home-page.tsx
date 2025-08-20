import PopularArtistsSection from "./popular-artists-section";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMusicPlayer } from "@contexts/music-player.context";
import AlbumCard from "./album-card";
import EditorsPicksSection, { EditorsPick } from "./editors-picks-section";
import PlaylistCard from "./playlist-card";
import PlaylistDetail from "./playlist-detail";
import { useQueryClient } from "@tanstack/react-query";
import WelcomeBanner from "./welcome-banner";
import VirtualizedTrackList from "./virtualized-track-list";
import AddToPlaylistModal from "./add-to-playlist-modal";
import SearchResults from "./search-results";
import TrendingSongs from "./trending-songs";
import CreatePlaylistModal from "./create-playlist-modal";
import { useTrendingSongsQuery } from "../../framework/music/get-trending-songs";
import { useAlbumsQuery } from "../../framework/music/get-albums";
import { useSearchQuery } from "../../framework/music/get-search";
import {
  usePlaylistsQuery,
  usePlaylistQuery,
} from "../../framework/music/get-playlists";
import { FaMusic } from "react-icons/fa";
import Link from "next/link";

import { FaHome } from "react-icons/fa";

const editorsPicks: EditorsPick[] = [];

const MusicHomePage = () => {
  const queryClient = useQueryClient();
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<null | {
    id: string;
    title: string;
    artist: string;
  }>(null);
  const router = useRouter();
  const { search } = router.query;
  const { state } = useMusicPlayer();
  // Removed unused playlists variable
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch data using React Query hooks
  const { data: trendingSongsData, isLoading: trendingSongsLoading } =
    useTrendingSongsQuery({ limit: 10 });
  const { data: albumsData } = useAlbumsQuery(true);
  // Removed unused artistsData and artistsLoading
  const { data: userPlaylists, isLoading: playlistsLoading } =
    usePlaylistsQuery();

  // Fetch selected playlist details
  const { data: selectedPlaylist, isLoading: selectedPlaylistLoading } =
    usePlaylistQuery(selectedPlaylistId || "", !!selectedPlaylistId);

  // Search functionality
  const searchQuery = typeof search === "string" ? search : "";
  const { data: searchResults, isLoading: searchLoading } = useSearchQuery({
    query: searchQuery,
    enabled: searchQuery.length > 0,
    limit: 20,
  });

  // Transform API data to match component expectations
  const tracks = (trendingSongsData?.data || []).map((song) => ({
    id: song.id?.toString() || "",
    title: song.title || "",
    artist: song.artist || "",
    album: song.album || "",
    duration: song.duration
      ? typeof song.duration === "string"
        ? song.duration.includes(":")
          ? song.duration
              .split(":")
              .reduce((acc, time) => 60 * acc + parseInt(time), 0)
          : parseInt(song.duration)
        : song.duration
      : 0,
    url: song.audioUrl || "",
    audioUrl: song.audioUrl || "",
    cover: song.cover || song.coverImage || "",
    coverImage: song.coverImage || song.cover || "",
    albumId: song.albumId || "",
  }));

  const albums = (albumsData || []).map((album) => ({
    id: album.id?.toString() || "",
    title: album.title || "",
    artist: album.artist || "",
    cover: album.coverImageUrl || "",
    tracks: (album.tracks || []).map((track) => ({
      id: track.id?.toString() || "",
      title: track.title || "",
      artist: track.artist || "",
      album: album.title || "",
      duration: track.duration
        ? typeof track.duration === "string"
          ? track.duration.includes(":")
            ? track.duration
                .split(":")
                .reduce((acc, time) => 60 * acc + parseInt(time), 0)
            : parseInt(track.duration)
          : track.duration
        : 0,
      url: track.audioUrl || "",
      audioUrl: track.audioUrl || "",
      cover: track.coverImage || album.coverImageUrl || "",
      coverImage: track.coverImage || album.coverImageUrl || "",
      albumId: album.id?.toString() || "",
    })),
    releaseDate: album.releaseDate || "",
    genre: album.genre || "",
  }));

  // Mock recently played data
  const recentlyPlayed = tracks.slice(0, 10);

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };

  const handlePlaylistPlayClick = (playlistId: string) => {
    // Handle play playlist logic
    console.log("Play playlist:", playlistId);
  };

  const handleClosePlaylistDetail = () => {
    setSelectedPlaylistId(null);
  };

  const handleCreatePlaylist = () => {
    setShowCreateModal(true);
  };

  // Handler to refresh playlists after a track is removed from a playlist
  const handleTrackRemovedFromPlaylist = () => {
    // Invalidate playlists query to refetch
    queryClient.invalidateQueries({ queryKey: ["playlists"] });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Mobile Top Bar with Home Icon */}
      <div className="w-full flex items-center justify-between pt-4 pb-2 px-4 sm:hidden">
        <Link href="/" aria-label="Home">
          <FaHome className="text-2xl text-white drop-shadow-lg" />
        </Link>
        {/* Spacer for centering title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 drop-shadow-lg uppercase">
            SUFI MUSIC
          </h1>
        </div>
        {/* Empty div for right-side spacing */}
        <div style={{ width: "2rem" }} />
      </div>

      {/* Modern Sufi Music Title (desktop/tablet) */}
      <div className="w-full flex-col items-center justify-center pt-8 pb-4 hidden sm:flex">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 drop-shadow-lg uppercase mb-2">
          SUFI MUSIC
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 rounded-full mb-2" />
      </div>

      {/* Editor's Picks Section */}
      <EditorsPicksSection editorsPicks={editorsPicks} />
      {/* Popular Artist - Horizontal Scroll Section */}
      <PopularArtistsSection />

      {/* Trending Songs */}
      <section className="mb-5 ml-3 mr-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending now</h2>
          <button
            className="text-gray-400 hover:text-white text-sm font-bold"
            onClick={() => setShowAllTrending(!showAllTrending)}
          >
            {showAllTrending ? "SHOW LESS" : "SEE ALL"}
          </button>
        </div>
        <TrendingSongs
          tracks={tracks}
          loading={trendingSongsLoading}
          showAll={showAllTrending}
          playlistName="Trending Songs"
        />
      </section>

      {/* Popular Albums */}
      <section className="mb-5 ml-3 mr-3">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular albums</h2>
          <Link href="/music">
            <button className="text-gray-400 hover:text-white text-sm font-bold">
              SEE ALL
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* Recently Played Tracks */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recently played</h2>
          <Link href="/music">
            <button className="text-gray-400 hover:text-white text-sm font-bold">
              SEE ALL
            </button>
          </Link>
        </div>
        <div className="bg-black bg-opacity-30 rounded-lg">
          <div className="border-b border-gray-800 px-4 py-2 hidden md:grid grid-cols-12 text-gray-400 text-sm">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-4">Album</div>
            <div className="col-span-2 text-right">Duration</div>
          </div>
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
            {recentlyPlayed.length > 0 ? (
              <VirtualizedTrackList
                tracks={recentlyPlayed}
                hasNextPage={false}
                loading={false}
                onLoadMore={() => {}}
                playlistName="Recently Played"
                height={Math.min(500, recentlyPlayed.length * 56)}
                itemHeight={56}
                onAddToPlaylist={(track) => {
                  setAddToPlaylistTrack({
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                  });
                }}
              />
            ) : (
              <div className="p-6 text-center text-gray-500">
                No recently played tracks.
              </div>
            )}
          </div>
        </div>
        {/* Add To Playlist Modal for Recently Played */}
        {addToPlaylistTrack && (
          <AddToPlaylistModal
            isOpen={!!addToPlaylistTrack}
            onClose={() => setAddToPlaylistTrack(null)}
            trackId={addToPlaylistTrack.id}
            trackTitle={addToPlaylistTrack.title}
            trackArtist={addToPlaylistTrack.artist}
          />
        )}
      </section>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        {/* Search Results */}
        {/* {searchQuery && searchResults && (
          <SearchResults
            searchResults={searchResults}
            loading={searchLoading}
            query={searchQuery}
          />
        )} */}

        {/* Selected Playlist Detail or Welcome Banner */}
        {selectedPlaylistId ? (
          <section className="mb-10">
            {selectedPlaylistLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
              </div>
            ) : selectedPlaylist ? (
              <PlaylistDetail
                playlist={selectedPlaylist}
                onClose={handleClosePlaylistDetail}
                onTrackRemoved={handleTrackRemovedFromPlaylist}
              />
            ) : null}
          </section>
        ) : (
          <section className="mb-10">
            <WelcomeBanner onCreatePlaylist={handleCreatePlaylist} />
          </section>
        )}

        {/* Your Playlists Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <button
              onClick={handleCreatePlaylist}
              className="text-gray-400 hover:text-white text-sm font-bold"
            >
              CREATE NEW
            </button>
          </div>

          {playlistsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg w-full aspect-square mb-3"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : userPlaylists && userPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {userPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  isSelected={selectedPlaylistId === playlist.id}
                  isPlaying={
                    state.currentPlaylistName === playlist.name &&
                    state.isPlaying
                  }
                  onClick={() => handlePlaylistClick(playlist.id)}
                  onPlayClick={() => handlePlaylistPlayClick(playlist.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaMusic className="text-6xl mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Playlists Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first playlist to start organizing your music.
              </p>
              <button
                onClick={handleCreatePlaylist}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Playlist
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default MusicHomePage;
