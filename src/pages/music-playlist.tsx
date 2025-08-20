import React from "react";
import { useRouter } from "next/router";
import { usePlaylistQuery } from "../framework/music/get-playlists";
import PlaylistDetail from "../components/music-redesign/playlist-detail";

const MusicPage = () => {
  const router = useRouter();
  const { playlist } = router.query;
  const playlistId = typeof playlist === "string" ? playlist : "";
  const { data: selectedPlaylist, isLoading } = usePlaylistQuery(
    playlistId,
    !!playlistId
  );

  if (!playlistId) {
    return (
      <div className="p-8 text-center text-gray-400">No playlist selected.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!selectedPlaylist) {
    return (
      <div className="p-8 text-center text-gray-400">Playlist not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col py-8">
      <PlaylistDetail
        playlist={selectedPlaylist}
        onClose={() => router.push("/music")}
      />
    </div>
  );
};

export default MusicPage;
