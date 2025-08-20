import React from "react";
import MusicLayout from "@components/music-redesign/music-layout";
import MusicHomePage from "@components/music-redesign/home-page";
import { PlaylistProvider } from "@contexts/playlist.context";

const MusicRedesignPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MusicLayout>
        {/* ✅ Wrap with PlaylistProvider */}
        <PlaylistProvider>
          <MusicHomePage />
        </PlaylistProvider>
      </MusicLayout>
    </div>
  );
};

export default MusicRedesignPage;
