import { useQuery } from "@tanstack/react-query";

export interface TrendingSong {
  id: number;
  title: string;
  artist: string;
  album?: string;
  albumId?: string;
  genre?: string;
  duration?: string;
  audioUrl?: string;
  cover?: string;
  coverImage?: string;
  views?: number;
  likes?: number;
  plays?: number;
  downloads?: number;
  lastPlayedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  trendingScore?: number;
  popularityScore?: number;
}

export interface TrendingSongsResponse {
  success: boolean;
  data: TrendingSong[];
  meta: {
    type: string;
    timeframe: number;
    limit: number;
    count: number;
    timestamp: string;
  };
}

export interface UseTrendingSongsOptions {
  limit?: number;
  timeframe?: number; // days
  type?: "trending" | "popular" | "mostPlayed";
  enabled?: boolean;
}

const fetchTrendingSongs = async (
  options: UseTrendingSongsOptions = {}
): Promise<TrendingSongsResponse> => {
  const { limit = 10, timeframe = 30, type = "trending" } = options;

  const params = new URLSearchParams({
    limit: limit.toString(),
    timeframe: timeframe.toString(),
    type: type,
  });

  const response = await fetch(`/api/music/trending-songs?${params}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch trending songs" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const useTrendingSongsQuery = (
  options: UseTrendingSongsOptions = {}
) => {
  const { enabled = true, ...fetchOptions } = options;

  return useQuery<TrendingSongsResponse, Error>({
    queryKey: ["trending-songs", fetchOptions],
    queryFn: () => fetchTrendingSongs(fetchOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Alternative hook names for different types
export const usePopularSongsQuery = (
  options: Omit<UseTrendingSongsOptions, "type"> = {}
) => {
  return useTrendingSongsQuery({ ...options, type: "popular" });
};

export const useMostPlayedSongsQuery = (
  options: Omit<UseTrendingSongsOptions, "type"> = {}
) => {
  return useTrendingSongsQuery({ ...options, type: "mostPlayed" });
};

export default useTrendingSongsQuery;
