import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@components/layout/layout";
import Container from "@components/ui/container";
import withAdminAuth from "@components/auth/withAdminAuth";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { CoverImageUploader } from "@components/ui/CoverImageUploader";
import { AudioUploader } from "@components/ui/AudioUploader";

interface Album {
  id: string;
  title: string;
  artistName: string;
}

interface Artist {
  id: string;
  name: string;
}

interface Track {
  id: string;
  title: string;
  artist: string; // API returns artist name, not artistId
  albumId: string;
  genre: string;
  audioUrl: string;
  coverImage: string;
  duration: string;
}

function EditTrack() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [track, setTrack] = useState<Track | null>(null);
  const [calculatingDuration, setCalculatingDuration] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    albumId: "",
    genre: "",
    audioUrl: "",
    coverImage: "",
    duration: "",
  });

  useEffect(() => {
    // Fetch albums and artists for dropdowns
    const fetchData = async () => {
      try {
        const albumsResponse = await fetch("/api/albums");
        if (albumsResponse.ok) {
          const albumsData = await albumsResponse.json();
          setAlbums(albumsData || []);
        } else {
          console.error("Failed to fetch albums");
        }

        const artistsResponse = await fetch("/api/artists");
        if (artistsResponse.ok) {
          const artistsData = await artistsResponse.json();
          setArtists(artistsData || []);
        } else {
          console.error("Failed to fetch artists");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Update form data when both track and artists are loaded
  useEffect(() => {
    if (track && artists.length > 0) {
      const matchingArtist = artists.find(artist => artist.name === track.artist);
      setFormData({
        title: track.title || "",
        artistId: matchingArtist?.id || "",
        albumId: track.albumId || "",
        genre: track.genre || "",
        audioUrl: track.audioUrl || "",
        coverImage: track.coverImage || "",
        duration: track.duration || "",
      });
    }
  }, [track, artists]);

  useEffect(() => {
    // Fetch track details when ID is available
    if (id && typeof id === "string") {
      fetch(`/api/tracks/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setTrack(data);
          setTrackLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching track:", error);
          alert("Failed to load track details");
          setTrackLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Find the selected artist name
    const selectedArtist = artists.find(artist => artist.id === formData.artistId);
    if (!selectedArtist) {
        alert("Selected artist not found. Please refresh and try again.");
        setLoading(false);
        return;
    }

    setLoading(true);

    // Prepare the payload, removing artistId and adding artist name
    const payload = {
        ...formData,
        artist: selectedArtist.name,
    };
    delete payload.artistId;

    try {
      const response = await fetch(`/api/tracks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/tracks");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update track");
      }
    } catch (error) {
      console.error("Error updating track:", error);
      alert("Failed to update track");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAudioDuration = async (audioUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.onloadedmetadata = () => {
            const duration = audio.duration;
            if (isNaN(duration) || duration === 0) {
                return reject(new Error('Unable to determine audio duration'));
            }
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            resolve(formattedDuration);
        };
        audio.onerror = () => reject(new Error('Failed to load audio file'));
        audio.src = audioUrl;
        audio.load();
    });
  };

  const handleAudioUploadComplete = async (url: string) => {
    setFormData(prev => ({ ...prev, audioUrl: url }));
    setCalculatingDuration(true);
    try {
        const duration = await calculateAudioDuration(url);
        setFormData(prev => ({ ...prev, duration }));
    } catch (error) {
        console.error("Error calculating duration:", error);
    } finally {
        setCalculatingDuration(false);
    }
  };

  if (trackLoading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </Container>
    );
  }

  if (!track) {
    return (
      <Container>
        <div className="py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Track Not Found
            </h1>
            <Link
              href="/admin/tracks"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Tracks
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/tracks"
            className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Tracks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Track: {track.title}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Track Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="Enter track title"
                  />
                </div>

                {/* Artist Dropdown */}
                <div>
                  <label htmlFor="artistId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Artist *
                  </label>
                  <select
                    id="artistId"
                    name="artistId"
                    value={formData.artistId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select an artist</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Album Selection */}
                <div>
                  <label htmlFor="albumId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Album
                  </label>
                  <select
                    id="albumId"
                    name="albumId"
                    value={formData.albumId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select an album</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title} - {album.artistName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Genre *
                  </label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="e.g., Pop, Rock, Hip-Hop"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (mm:ss)
                    {calculatingDuration && (
                        <span className="ml-2 text-blue-600 text-sm">Calculating...</span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    pattern="^[0-9]{1,2}:[0-5][0-9]$"
                    disabled={calculatingDuration}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                    placeholder="e.g., 3:45 or upload to auto-calculate"
                  />
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <CoverImageUploader
                    onUploadComplete={(url) => {
                      setFormData((prev) => ({ ...prev, coverImage: url }));
                    }}
                    currentImage={formData.coverImage}
                    onRemove={() => {
                      setFormData((prev) => ({ ...prev, coverImage: "" }));
                    }}
                    className="w-full"
                  />
                </div>

                {/* Audio Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audio File *
                  </label>
                  <AudioUploader
                    onUploadComplete={handleAudioUploadComplete}
                    currentAudio={formData.audioUrl}
                    onRemove={() => {
                      setFormData((prev) => ({ ...prev, audioUrl: "", duration: "" }));
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || calculatingDuration}
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-4 h-4" />
                {loading ? "Updating..." : "Update Track"}
              </button>
              
              <Link
                href="/admin/tracks"
                className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}

EditTrack.Layout = Layout;
export default withAdminAuth(EditTrack);
