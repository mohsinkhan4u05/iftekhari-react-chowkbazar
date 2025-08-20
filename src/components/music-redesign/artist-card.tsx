import React from "react";
import { useRouter } from "next/router";
import { Artist } from "@contexts/music-player.context";
import { useSession } from "next-auth/react";
import { FaPlay, FaCheck } from "react-icons/fa";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const router = useRouter();

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    // In a real implementation, this would call the API to follow/unfollow the artist
    setIsFollowing(!isFollowing);
  };

  const formatAlbumCount = (count: number) => {
    return `${count} ${count === 1 ? "album" : "albums"}`;
  };

  return (
    <div
      className="bg-gray-800 rounded-md p-4 hover:bg-gray-700 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div
          className="relative aspect-square rounded-full overflow-hidden mx-auto cursor-pointer"
          onClick={() => router.push(`/music?artistId=${artist.id}`)}
        >
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-4xl text-white font-bold">
                {artist.name?.charAt(0) || "A"}
              </div>
            </div>
          )}
        </div>

        {/* Play Button Overlay */}
        <button
          className={`absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 shadow-lg transform transition-all duration-300 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          } hover:scale-110 hover:bg-green-400`}
          aria-label={`Play ${artist.name}'s top tracks`}
        >
          <FaPlay className="text-black" />
        </button>
      </div>

      <div className="mt-2 text-center">
        <h3
          className="font-semibold text-white truncate hover:underline cursor-pointer"
          onClick={() => router.push(`/music?artistId=${artist.id}`)}
        >
          {artist.name}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {artist.albums ? formatAlbumCount(artist.albums.length) : "Artist"}
        </p>

        {/* Follow Button */}
        {session && (
          <button
            onClick={handleFollow}
            className={`mt-2 flex items-center justify-center w-full py-1 rounded-full text-xs font-semibold transition-colors ${
              isFollowing
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {isFollowing ? (
              <>
                <FaCheck className="mr-1" /> Following
              </>
            ) : (
              "Follow"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
