import React from "react";
import { useRouter } from "next/router";
import { Album } from "@contexts/music-player.context";
import { useMusicPlayer } from "@contexts/music-player.context";
import { FaPlay } from "react-icons/fa";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const { playTrack } = useMusicPlayer();
  const [isHovered, setIsHovered] = React.useState(false);
  const router = useRouter();

  const handlePlayAlbum = (e: React.MouseEvent) => {
    e.preventDefault();
    // Play the first track of the album
    if (album.tracks && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks, album.title);
    }
  };

  const formatTrackCount = (count: number) => {
    return `${count} ${count === 1 ? "track" : "tracks"}`;
  };

  return (
    <div
      className="bg-gray-800 rounded-md p-4 hover:bg-gray-700 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div
          className="relative aspect-square rounded-md overflow-hidden cursor-pointer"
          onClick={() => router.push(`/music?albumId=${album.id}`)}
        >
          {album.cover ? (
            <img
              src={album.cover}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-4xl text-white opacity-50">
                <FaPlay className="transform -rotate-90" />
              </div>
            </div>
          )}
        </div>

        {/* Play Button Overlay */}
        <button
          onClick={handlePlayAlbum}
          className={`absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 shadow-lg transform transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          } hover:scale-110 hover:bg-green-400`}
          aria-label={`Play ${album.title}`}
        >
          <FaPlay className="text-black" />
        </button>
      </div>

      <div className="mt-2">
        <h3
          className="font-semibold text-white truncate hover:underline cursor-pointer"
          onClick={() => router.push(`/music?albumId=${album.id}`)}
        >
          {album.title}
        </h3>
        <p className="text-gray-400 text-sm truncate">{album.artist}</p>
        <p className="text-gray-500 text-xs mt-1">
          {album.tracks ? formatTrackCount(album.tracks.length) : "Album"}
        </p>
      </div>
    </div>
  );
};

export default AlbumCard;
