import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlay, FaPause, FaArrowLeft, FaMusic, FaPlus } from "react-icons/fa";
import { useMusicPlayer } from "@contexts/music-player.context";
import AddToPlaylistModal from "@components/music-redesign/add-to-playlist-modal";

const fallbackImage = "/assets/images/placeholder-blur.jpg";

const ArtistDetailPage: React.FC = () => {
  const router = useRouter();
  const { artistId } = router.query;
  const { state, playTrack } = useMusicPlayer();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<null | {
    id: string;
    title: string;
    artist: string;
  }>(null);

  useEffect(() => {
    if (!artistId) return;
    setLoading(true);
    fetch(`/api/music/artists/${artistId}`)
      .then((res) => res.json())
      .then((data) => {
        setArtist(data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [artistId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaMusic className="text-5xl text-gray-400 mb-4" />
        <div className="text-lg text-gray-500">Loading artist...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FaMusic className="text-5xl text-gray-400 mb-4" />
        <div className="text-lg text-gray-500">Artist not found.</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      {/* Back Button */}
      <div className="p-4 md:p-6">
        <button
          onClick={() => router.push("/music")}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </button>
      </div>

      {/* Artist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end px-6 pb-6">
        {artist.image ? (
          <div className="w-64 h-64 md:w-80 md:h-80 shadow-2xl mb-6 md:mb-0 md:mr-8">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>
        ) : (
          <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-purple-900 to-blue-900 rounded-full shadow-2xl mb-6 md:mb-0 md:mr-8 flex items-center justify-center">
            <span className="text-6xl font-bold text-white opacity-50">
              {artist.name?.charAt(0) || "A"}
            </span>
          </div>
        )}
        <div className="text-center md:text-left">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">
            Artist
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{artist.name}</h1>
          {artist.bio && <p className="text-gray-300 mb-2">{artist.bio}</p>}
          <div className="text-xs text-gray-500 mb-2">
            Created: {artist.createdAt}
          </div>
        </div>
      </div>

      {/* Albums & Tracks */}
      <div className="px-6 pb-24">
        {artist.albums && artist.albums.length > 0 ? (
          artist.albums.map((album: any) => (
            <div key={album.id} className="mb-10">
              <div className="flex items-center space-x-4 mb-2">
                <img
                  src={album.coverImageUrl || fallbackImage}
                  alt={album.title}
                  className="w-16 h-16 rounded object-cover border-2 border-gray-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackImage;
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold">{album.title}</h3>
                  <div className="text-xs text-gray-500">{album.genre}</div>
                  <div className="text-xs text-gray-400">
                    Released: {album.releaseDate}
                  </div>
                </div>
              </div>
              <div className="bg-black bg-opacity-30 rounded-lg">
                <div className="border-b border-gray-800 px-4 py-2 grid grid-cols-12 text-gray-400 text-sm">
                  <div className="col-span-1">#</div>
                  <div className="col-span-7">Title</div>
                  <div className="col-span-2">Album</div>
                  <div className="col-span-2 text-right">Duration</div>
                </div>
                <div>
                  {album.tracks && album.tracks.length > 0 ? (
                    album.tracks.map((track: any, idx: number) => {
                      // Build a playlist of all tracks from all albums for this artist
                      const artistPlaylist = artist.albums.flatMap(
                        (a: any) => a.tracks || []
                      );
                      const isPlaying =
                        state.currentTrack?.id === track.id && state.isPlaying;
                      return (
                        <div
                          key={track.id}
                          className={`grid grid-cols-12 items-center px-4 py-2 text-white hover:bg-gray-800 transition-colors cursor-pointer ${
                            isPlaying ? "bg-green-900" : ""
                          }`}
                        >
                          <div
                            className="col-span-1 flex items-center justify-center"
                            onClick={() => {
                              playTrack(track, artistPlaylist, artist.name);
                            }}
                          >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                          </div>
                          <div className="col-span-7 font-medium truncate flex items-center">
                            <span
                              className="flex-1"
                              onClick={() => {
                                playTrack(track, artistPlaylist, artist.name);
                              }}
                            >
                              {track.title}
                            </span>
                          </div>
                          <div className="col-span-2 text-xs text-gray-400 truncate">
                            {album.title}
                          </div>
                          <div className="col-span-2 text-right text-xs text-gray-400">
                            {track.duration
                              ? `${Math.floor(track.duration / 60)}:${(
                                  track.duration % 60
                                )
                                  .toString()
                                  .padStart(2, "0")}`
                              : "0:00"}
                            <button
                              className="ml-2 text-gray-400 hover:text-blue-400"
                              title="Add to Playlist"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddToPlaylistTrack({
                                  id: track.id,
                                  title: track.title,
                                  artist: track.artist,
                                });
                              }}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-400 px-4 py-4">
                      No tracks found for this album.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No albums found for this artist.</div>
        )}
      </div>
      {/* Add To Playlist Modal */}
      {addToPlaylistTrack && (
        <AddToPlaylistModal
          isOpen={!!addToPlaylistTrack}
          onClose={() => setAddToPlaylistTrack(null)}
          trackId={addToPlaylistTrack.id}
          trackTitle={addToPlaylistTrack.title}
          trackArtist={addToPlaylistTrack.artist}
        />
      )}
    </div>
  );
};

export default ArtistDetailPage;
