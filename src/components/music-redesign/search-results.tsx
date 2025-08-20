import React from "react";
import { FaPlay, FaMusic, FaCompactDisc, FaMicrophone } from "react-icons/fa";
import { useMusicPlayer } from "@contexts/music-player.context";
import AlbumCard from "./album-card";
import ArtistCard from "./artist-card";
import VirtualizedTrackList from "./virtualized-track-list";
import { SearchResult } from "../../framework/music/get-search";

interface SearchResultsProps {
  searchResults: SearchResult;
  loading: boolean;
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  loading,
  query,
}) => {
  const { playTrack } = useMusicPlayer();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { tracks, albums, artists } = searchResults;
  const hasResults =
    tracks.length > 0 || albums.length > 0 || artists.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <FaMusic className="mx-auto text-gray-500 text-6xl mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No results found for "{query}"
        </h3>
        <p className="text-gray-500">
          Try searching for a different song, artist, or album
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tracks Section */}
      {tracks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FaMusic className="text-green-500 text-2xl" />
            <h2 className="text-2xl font-bold">Songs</h2>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <VirtualizedTrackList
              tracks={tracks}
              hasNextPage={false}
              loading={false}
              onLoadMore={() => {}}
              playlistName="Search Results"
              height={Math.min(tracks.length * 56, 400)}
              itemHeight={56}
            />
          </div>
        </section>
      )}

      {/* Albums Section */}
      {albums.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FaCompactDisc className="text-green-500 text-2xl" />
            <h2 className="text-2xl font-bold">Albums</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* Artists Section */}
      {artists.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FaMicrophone className="text-green-500 text-2xl" />
            <h2 className="text-2xl font-bold">Artists</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
