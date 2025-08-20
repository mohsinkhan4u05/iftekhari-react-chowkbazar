import React from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MusicLayout from "@components/music-redesign/music-layout";
import MusicHomePage from "@components/music-redesign/home-page";
import AlbumDetail from "@components/music-redesign/album-detail";
import ArtistDetail from "@components/music-redesign/artist-detail";
import PlaylistDetail from "@components/music-redesign/playlist-detail";
import { usePlaylistQuery } from "../framework/music/get-playlists";

const MusicPage = () => {
  const router = useRouter();
  const { albumId, artistId, playlistId } = router.query;

  // Only use artistId if it's a non-empty string
  const validArtistId =
    typeof artistId === "string" && artistId.trim().length > 0
      ? artistId
      : undefined;
  // Only use albumId if it's a non-empty string
  const validAlbumId =
    typeof albumId === "string" && albumId.trim().length > 0
      ? albumId
      : undefined;
  // Only use playlistId if it's a non-empty string
  const validPlaylistId =
    typeof playlistId === "string" && playlistId.trim().length > 0
      ? playlistId
      : undefined;

  const { data: selectedPlaylist, isLoading } = usePlaylistQuery(
    validPlaylistId || "",
    !!validPlaylistId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MusicLayout>
        {validPlaylistId ? (
          isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
            </div>
          ) : selectedPlaylist ? (
            <PlaylistDetail
              playlist={selectedPlaylist}
              onClose={() => router.push("/music")}
            />
          ) : (
            <div className="p-8 text-center text-gray-400">
              Playlist not found.
            </div>
          )
        ) : validAlbumId ? (
          <AlbumDetail albumId={validAlbumId} />
        ) : validArtistId ? (
          <ArtistDetail artistId={validArtistId} />
        ) : (
          <MusicHomePage />
        )}
      </MusicLayout>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default MusicPage;
