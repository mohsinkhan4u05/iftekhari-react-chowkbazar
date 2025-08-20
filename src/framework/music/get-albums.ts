import { useQuery } from "@tanstack/react-query";

export interface AlbumTrack {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  genre?: string;
  duration?: string;
  audioUrl?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  trackNumber?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverImageUrl?: string;
  releaseDate?: string;
  genre?: string;
  createdAt?: string;
  updatedAt?: string;
  tracks: AlbumTrack[];
}

export interface AlbumsResponse extends Array<Album> {}

const fetchAlbums = async (): Promise<AlbumsResponse> => {
  const response = await fetch(`/api/music/albums`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch albums" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const useAlbumsQuery = (enabled: boolean = true) => {
  return useQuery<AlbumsResponse, Error>({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useAlbumsQuery;
