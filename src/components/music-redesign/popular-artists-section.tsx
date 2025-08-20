import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

type Artist = {
  id: string;
  name: string;
  profileImageUrl?: string | null;
};

const PopularArtistsSection: React.FC = () => {
  const router = useRouter();
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [imgErrorIds, setImgErrorIds] = React.useState<Record<string, boolean>>(
    {}
  );

  React.useEffect(() => {
    fetch("/api/music/artists?limit=20&sort=popular")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtists(
            data.map((a: any) => ({
              id: String(a.id),
              name: a.name ?? "Unknown",
              profileImageUrl: a.profileImageUrl ?? null,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 px-2">Popular Artists</h2>

      <div className="relative">
        <div
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex space-x-5 px-2">
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-[120px] flex-shrink-0 flex flex-col items-center"
                >
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-800 animate-pulse mb-2" />
                  <div className="h-5 w-20 bg-gray-700 rounded mb-1 animate-pulse" />
                </div>
              ))
            ) : artists.length > 0 ? (
              artists.map((artist, idx) => {
                const hasImage =
                  !!artist.profileImageUrl && !imgErrorIds[artist.id];
                return (
                  <motion.div
                    key={artist.id}
                    whileHover={{
                      scale: 1.06,
                      boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: idx * 0.06,
                      type: "spring",
                      stiffness: 120,
                    }}
                    className="w-[120px] flex-shrink-0 flex flex-col items-center cursor-pointer"
                    onClick={() => router.push(`/music?artistId=${artist.id}`)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${artist.name}`}
                  >
                    <div className="w-[120px] h-[120px] rounded-full border-2 border-gray-800 shadow-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-700 mb-2">
                      {hasImage ? (
                        <img
                          src={artist.profileImageUrl as string}
                          alt={artist.name}
                          className="w-full h-full object-cover block"
                          onError={() =>
                            setImgErrorIds((prev) => ({
                              ...prev,
                              [artist.id]: true,
                            }))
                          }
                        />
                      ) : (
                        <span className="text-4xl font-bold text-white select-none">
                          {(artist.name?.charAt(0) ?? "A").toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="text-sm font-semibold text-center truncate w-[120px]">
                      {artist.name}
                    </span>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-gray-400 px-4 py-8">No artists found.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularArtistsSection;
