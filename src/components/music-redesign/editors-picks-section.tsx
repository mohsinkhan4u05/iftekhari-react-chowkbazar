import React from "react";
import { motion } from "framer-motion";

export interface EditorsPick {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  type: "album" | "playlist" | "track";
  track?: any;
}

interface EditorsPicksSectionProps {
  editorsPicks?: EditorsPick[];
}

const EditorsPicksSection: React.FC<EditorsPicksSectionProps> = ({
  editorsPicks: initialEditorsPicks = [],
}) => {
  const { playTrack } =
    require("@contexts/music-player.context").useMusicPlayer();
  const fallbackImage = "/assets/images/placeholder-blur.jpg";

  const [editorsPicks, setEditorsPicks] =
    React.useState<EditorsPick[]>(initialEditorsPicks);
  const [loading, setLoading] = React.useState(false);

  // Fetch latest 10 tracks from database on mount
  React.useEffect(() => {
    setLoading(true);
    fetch("/api/music/tracks?limit=20&sort=latest")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          const picks = data.data.map((track: any) => ({
            id: track.id,
            title: track.title,
            subtitle: track.artist,
            imageUrl: track.coverImage || track.cover || fallbackImage,
            type: "track",
            track: track,
          }));
          setEditorsPicks(picks);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch latest tracks for Editor's Picks", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Play a mock track when an Editor's Pick is clicked
  const handleClick = (pick: EditorsPick) => {
    if (pick.type === "track" && pick.track) {
      playTrack(pick.track, [pick.track], pick.title);
      return;
    }
    // fallback to previous logic for album/playlist
    if (pick.type === "album" || pick.type === "playlist") {
      const endpoint =
        pick.type === "album"
          ? `/api/music/albums/${pick.id}`
          : `/api/music/playlists/${pick.id}`;
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          let tracks = [];
          let playlistName = pick.title;
          if (pick.type === "album" && data.tracks) {
            tracks = data.tracks;
            playlistName = data.title || pick.title;
          } else if (pick.type === "playlist" && data.tracks) {
            tracks = data.tracks;
            playlistName = data.name || pick.title;
          }
          if (tracks.length > 0) {
            playTrack(tracks[0], tracks, playlistName);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch tracks for Editor's Pick", err);
        });
    }
  };

  // Ref for horizontal scroll
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 px-2">Editor's Picks</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400"></div>
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 rounded-full p-2 hover:bg-gray-700 focus:outline-none"
            style={{ display: "block" }}
            onClick={() => scrollBy(-300)}
            aria-label="Scroll left"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="text-white"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex space-x-0 px-2">
              {editorsPicks.slice(0, 20).map((pick, idx) => (
                <EditorsPickCard
                  key={pick.id}
                  pick={pick}
                  idx={idx}
                  handleClick={handleClick}
                  fallbackImage={fallbackImage}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 rounded-full p-2 hover:bg-gray-700 focus:outline-none"
            style={{ display: "block" }}
            onClick={() => scrollBy(300)}
            aria-label="Scroll right"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="text-white"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default EditorsPicksSection;

// EditorsPickCard component and its props interface moved outside
interface EditorsPickCardProps {
  pick: EditorsPick;
  idx: number;
  handleClick: (pick: EditorsPick) => void;
  fallbackImage: string;
}

const EditorsPickCard: React.FC<EditorsPickCardProps> = ({
  pick,
  idx,
  handleClick,
  fallbackImage,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Generate two random colors for gradient
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const [color1] = React.useState(getRandomColor());
  const [color2] = React.useState(getRandomColor());

  // fallback image logic
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: idx * 0.08,
        type: "spring",
        stiffness: 120,
      }}
      className="min-w-[180px] max-w-[180px] bg-gray-900 rounded-2xl shadow-md hover:shadow-lg cursor-pointer flex-shrink-0 flex flex-col items-center p-5 relative"
      onClick={() => handleClick(pick)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full relative">
        {pick.imageUrl && pick.imageUrl !== fallbackImage ? (
          <img
            src={pick.imageUrl}
            alt={pick.title}
            className="rounded-xl w-full h-[170px] object-cover mb-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== fallbackImage) {
                target.src = fallbackImage;
              }
            }}
          />
        ) : (
          <div
            className="w-full h-[170px] mb-3 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color1}, ${color2})`,
            }}
          >
            <span className="text-4xl font-extrabold text-white opacity-80 select-none">
              {pick.title?.slice(0, 1).toUpperCase() || "T"}
            </span>
          </div>
        )}
        {isHovered && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-200"
            style={{ border: "none", outline: "none" }}
            aria-label="Play"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 text-white drop-shadow-lg"
            >
              <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
              <polygon points="10,8 16,12 10,16" fill="white" />
            </svg>
          </button>
        )}
      </div>
      <div className="w-full">
        <h3 className="text-base font-bold text-white truncate mb-1">
          {pick.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{pick.subtitle}</p>
      </div>
    </motion.div>
  );
};
