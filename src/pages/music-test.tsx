import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MusicLayout from "@components/music-redesign/music-layout";
import AlbumCard from "@components/music-redesign/album-card";
import ArtistCard from "@components/music-redesign/artist-card";
import PlaylistCard from "@components/music-redesign/playlist-card";
import TrackCard from "@components/music-redesign/track-card";
import SearchBar from "@components/music-redesign/search-bar";

const MusicTestPage = () => {
  // Mock data for testing
  const mockTrack = {
    id: "1",
    title: "Mast Kalandar",
    artist: "Nusrat Fateh Ali Khan",
    album: "Devotional Songs",
    duration: 240,
    url: "/path/to/song1.mp3",
    cover: "/assets/images/music/album1.jpg",
  };

  const mockAlbum = {
    id: "1",
    title: "Sufi Classics",
    artist: "Various Artists",
    cover: "/assets/images/music/album1.jpg",
    tracks: [],
    releaseDate: "2023-01-01",
  };

  const mockArtist = {
    id: "1",
    name: "Nusrat Fateh Ali Khan",
    image: "/assets/images/music/artist1.jpg",
    bio: "Legendary Qawwali singer",
    albums: [],
  };

  const mockPlaylist = {
    id: "1",
    name: "My Favorite Sufi Tracks",
    description: "A collection of my favorite Sufi songs",
    cover: "/assets/images/music/playlist1.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trackCount: 12,
    tracks: [],
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MusicLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Music Redesign Test Page</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Search Bar</h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Track Card</h2>
            <div className="max-w-md">
              <TrackCard track={mockTrack} index={0} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Album Card</h2>
            <div className="max-w-xs">
              <AlbumCard album={mockAlbum} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Artist Card</h2>
            <div className="max-w-xs">
              <ArtistCard artist={mockArtist} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Playlist Card</h2>
            <div className="max-w-xs">
              <PlaylistCard playlist={mockPlaylist} />
            </div>
          </div>
        </div>
      </MusicLayout>
    </div>
  );
};

MusicTestPage.Layout = MusicLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default MusicTestPage;
