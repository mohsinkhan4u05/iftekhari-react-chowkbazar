import { useQuery } from "@tanstack/react-query";

export interface ArtistAlbum {
  id: string;
  title: string;
  genre?: string;
  description?: string;
  releaseDate?: string;
  releaseYear?: number;
  coverImageUrl?: string;
  totalTracks?: number;
  totalDuration?: string;
  status?: string;
  views?: number;
  likes?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  genre?: string;
  country?: string;
  website?: string;
  profileImageUrl?: string;
  socialMedia?: string;
  birthDate?: string;
  deathDate?: string;
  isActive?: boolean;
  status?: string;
  totalAlbums?: number;
  totalTracks?: number;
  totalViews?: number;
  totalLikes?: number;
  followers?: number;
  createdAt?: string;
  updatedAt?: string;
  albums: ArtistAlbum[];
}

export interface ArtistsResponse extends Array<Artist> {}

const fetchArtists = async (): Promise<ArtistsResponse> => {
  const response = await fetch(`/api/music/artists`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to fetch artists" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

export const useArtistsQuery = (enabled: boolean = true) => {
  return useQuery<ArtistsResponse, Error>({
    queryKey: ["artists"],
    queryFn: fetchArtists,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export default useArtistsQuery;
