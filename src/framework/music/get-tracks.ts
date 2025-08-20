import { useQuery } from "@tanstack/react-query";

export interface Track {
  id: string;
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
}

export interface TracksResponse {
  data: Track[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    search: string;
    sortBy: string;
    sortOrder: string;
    genre: string;
    artist: string;
  };
}

export interface UseTracksOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  genre?: string;
  artist?: string;
  enabled?: boolean;
}

const fetchTracks = async (
  options: UseTracksOptions = {}
): Promise<TracksResponse> => {
  const {
    page = 1,
    limit = 50,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    genre = "",
    artist = "",
  } = options;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    sortBy,
    sortOrder,
    ...(genre && { genre }),
    ...(artist && { artist }),
  });

  const response = await fetch(`/api/music/tracks?${params}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch tracks" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const useTracksQuery = (options: UseTracksOptions = {}) => {
  const { enabled = true, ...fetchOptions } = options;

  return useQuery<TracksResponse, Error>({
    queryKey: ["tracks", fetchOptions],
    queryFn: () => fetchTracks(fetchOptions),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useTracksQuery;
