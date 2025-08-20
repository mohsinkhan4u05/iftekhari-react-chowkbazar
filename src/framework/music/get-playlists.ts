import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  isPublic: boolean;
  totalTracks: number;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface PlaylistWithTracks extends Playlist {
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumId?: string;
  genre?: string;
  duration: number;
  audioUrl?: string;
  url?: string; // For compatibility with music player context
  cover?: string;
  coverImage?: string;
  addedAt: string;
  position: number;
}

export interface CreatePlaylistData {
  name: string;
  description?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylistData {
  name?: string;
  description?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}

// Fetch user's playlists
const fetchPlaylists = async (): Promise<Playlist[]> => {
  const response = await fetch("/api/music/playlists");
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch playlists" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Fetch specific playlist with tracks
const fetchPlaylist = async (playlistId: string): Promise<PlaylistWithTracks> => {
  const response = await fetch(`/api/music/playlists/${playlistId}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to fetch playlist" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Transform tracks to match music player context interface
  const transformedTracks = data.tracks.map((track: any) => ({
    ...track,
    url: track.audioUrl || "", // Add url property for compatibility with fallback
    cover: track.coverImage || "", // Add cover property for compatibility with fallback
  }));

  return {
    ...data,
    tracks: transformedTracks,
  };
};

// Create new playlist
const createPlaylist = async (data: CreatePlaylistData): Promise<Playlist> => {
  const response = await fetch("/api/music/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to create playlist" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Update playlist
const updatePlaylist = async ({ id, ...data }: { id: string } & UpdatePlaylistData): Promise<Playlist> => {
  const response = await fetch(`/api/music/playlists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to update playlist" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Delete playlist
const deletePlaylist = async (playlistId: string): Promise<{ message: string }> => {
  const response = await fetch(`/api/music/playlists/${playlistId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete playlist" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Add track to playlist
const addTrackToPlaylist = async ({ playlistId, trackId }: { playlistId: string; trackId: string }): Promise<{ message: string; success: boolean; alreadyExists: boolean }> => {
  const response = await fetch(`/api/music/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to add track to playlist" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Remove track from playlist
const removeTrackFromPlaylist = async ({ playlistId, trackId }: { playlistId: string; trackId: string }): Promise<{ message: string }> => {
  const response = await fetch(`/api/music/playlists/${playlistId}/tracks`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to remove track from playlist" }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// React Query hooks
export const usePlaylistsQuery = () => {
  return useQuery<Playlist[], Error>({
    queryKey: ["playlists"],
    queryFn: fetchPlaylists,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const usePlaylistQuery = (playlistId: string, enabled: boolean = true) => {
  return useQuery<PlaylistWithTracks, Error>({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchPlaylist(playlistId),
    enabled: enabled && !!playlistId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Playlist, Error, CreatePlaylistData>({
    mutationFn: createPlaylist,
    onSuccess: () => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

export const useUpdatePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Playlist, Error, { id: string } & UpdatePlaylistData>({
    mutationFn: updatePlaylist,
    onSuccess: (data) => {
      // Update both playlists list and individual playlist
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", data.id] });
    },
  });
};

export const useDeletePlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

export const useAddTrackToPlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; success: boolean; alreadyExists: boolean },
    Error,
    { playlistId: string; trackId: string }
  >({
    mutationFn: addTrackToPlaylist,
    onSuccess: (data, variables) => {
      // Invalidate playlists and specific playlist
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
    },
  });
};

export const useRemoveTrackFromPlaylistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { playlistId: string; trackId: string }
  >({
    mutationFn: removeTrackFromPlaylist,
    onSuccess: (data, variables) => {
      // Invalidate playlists and specific playlist
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
    },
  });
}; 