import { useQuery } from "@tanstack/react-query";

export interface SearchResult {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumId?: string;
  genre?: string;
  duration?: string | number;
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

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverImageUrl?: string;
  releaseDate?: string;
  genre?: string;
  tracks?: Track[];
  totalTracks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  profileImageUrl?: string;
  bio?: string;
  genre?: string;
  country?: string;
  totalAlbums?: number;
  totalTracks?: number;
  followers?: number;
  albums?: Album[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  tracks?: Track[];
  totalTracks?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UseSearchOptions {
  query: string;
  enabled?: boolean;
  limit?: number;
}

const fetchSearchResults = async (
  query: string,
  limit: number = 20
): Promise<SearchResult> => {
  if (!query.trim()) {
    return {
      tracks: [],
      albums: [],
      artists: [],
      playlists: [],
    };
  }

  try {
    // Search tracks
    const tracksResponse = await fetch(
      `/api/music/tracks?search=${encodeURIComponent(query)}&limit=${limit}`
    );
    const tracksData = tracksResponse.ok
      ? await tracksResponse.json()
      : { data: [] };

    // Search albums
    const albumsResponse = await fetch(
      `/api/music/albums?search=${encodeURIComponent(query)}&limit=${limit}`
    );
    const albumsData = albumsResponse.ok ? await albumsResponse.json() : [];

    // Search artists
    const artistsResponse = await fetch(
      `/api/music/artists?search=${encodeURIComponent(query)}&limit=${limit}`
    );
    const artistsData = artistsResponse.ok ? await artistsResponse.json() : [];

    // For now, we'll use empty playlists since there's no playlist search API
    const playlists: Playlist[] = [];

    return {
      tracks: tracksData.data || [],
      albums: albumsData || [],
      artists: artistsData || [],
      playlists,
    };
  } catch (error) {
    console.error("Search API Error:", error);
    return {
      tracks: [],
      albums: [],
      artists: [],
      playlists: [],
    };
  }
};

export const useSearchQuery = (options: UseSearchOptions) => {
  const { query, enabled = true, limit = 20 } = options;

  return useQuery<SearchResult, Error>({
    queryKey: ["search", query, limit],
    queryFn: () => fetchSearchResults(query, limit),
    enabled: enabled && query?.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });
};

export default useSearchQuery;
