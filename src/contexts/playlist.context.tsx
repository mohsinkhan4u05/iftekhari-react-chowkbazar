import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Track } from '@contexts/music-player.context';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  createdAt: string;
  updatedAt: string;
  trackCount: number;
  tracks?: Track[];
}

interface PlaylistContextType {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string, description?: string) => Promise<Playlist | null>;
  updatePlaylist: (id: string, name: string, description?: string) => Promise<boolean>;
  deletePlaylist: (id: string) => Promise<boolean>;
  getPlaylistById: (id: string) => Promise<Playlist | null>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<{ success: boolean; alreadyExists?: boolean; message?: string }>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<boolean>;
  reorderPlaylistTracks: (playlistId: string, trackIds: string[]) => Promise<boolean>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/music/playlists');
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const data = await response.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to load playlists');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  // Automatically fetch playlists when session is available
  useEffect(() => {
    if (session?.user?.email) {
      fetchPlaylists();
    } else {
      // Clear playlists when user logs out
      setPlaylists([]);
      setError(null);
    }
  }, [session?.user?.email, fetchPlaylists]);

  const createPlaylist = useCallback(async (name: string, description?: string): Promise<Playlist | null> => {
    if (!session?.user?.email) return null;

    setError(null);

    try {
      const response = await fetch('/api/music/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description?.trim() || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create playlist');
      }

      const data = await response.json();
      const newPlaylist = data.playlist;

      setPlaylists(prev => [newPlaylist, ...prev]);
      return newPlaylist;
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
      return null;
    }
  }, [session?.user?.email]);

  const updatePlaylist = useCallback(async (id: string, name: string, description?: string): Promise<boolean> => {
    if (!session?.user?.email) return false;

    setError(null);

    try {
      const response = await fetch(`/api/music/playlists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description?.trim() || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update playlist');
      }

      const data = await response.json();
      
      setPlaylists(prev => 
        prev.map(playlist => 
          playlist.id === id 
            ? { ...playlist, ...data.playlist }
            : playlist
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to update playlist');
      return false;
    }
  }, [session?.user?.email]);

  const deletePlaylist = useCallback(async (id: string): Promise<boolean> => {
    if (!session?.user?.email) return false;

    setError(null);

    try {
      const response = await fetch(`/api/music/playlists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete playlist');
      }

      setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete playlist');
      return false;
    }
  }, [session?.user?.email]);

  const getPlaylistById = useCallback(async (id: string): Promise<Playlist | null> => {
    if (!session?.user?.email) return null;

    setError(null);

    try {
      const response = await fetch(`/api/music/playlists/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch playlist');
      }

      const data = await response.json();
      return data.playlist;
    } catch (err) {
      console.error('Error fetching playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
      return null;
    }
  }, [session?.user?.email]);

  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string): Promise<{ success: boolean; alreadyExists?: boolean; message?: string }> => {
    if (!session?.user?.email) return { success: false, message: 'Not authenticated' };

    setError(null);

    try {
      const response = await fetch(`/api/music/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add track to playlist');
      }

      // Only update track count if track wasn't already in playlist
      if (!data.alreadyExists) {
        setPlaylists(prev => 
          prev.map(playlist => 
            playlist.id === playlistId 
              ? { ...playlist, trackCount: playlist.trackCount + 1, updatedAt: new Date().toISOString() }
              : playlist
          )
        );
      }

      return {
        success: true,
        alreadyExists: data.alreadyExists || false,
        message: data.message
      };
    } catch (err) {
      console.error('Error adding track to playlist:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add track to playlist';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [session?.user?.email]);

  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string): Promise<boolean> => {
    if (!session?.user?.email) return false;

    setError(null);

    try {
      const response = await fetch(`/api/music/playlists/${playlistId}/tracks`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove track from playlist');
      }

      // Update local playlist track count
      setPlaylists(prev => 
        prev.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, trackCount: Math.max(0, playlist.trackCount - 1), updatedAt: new Date().toISOString() }
            : playlist
        )
      );

      return true;
    } catch (err) {
      console.error('Error removing track from playlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove track from playlist');
      return false;
    }
  }, [session?.user?.email]);

  const reorderPlaylistTracks = useCallback(async (playlistId: string, trackIds: string[]): Promise<boolean> => {
    if (!session?.user?.email) return false;

    setError(null);

    try {
      const response = await fetch(`/api/music/playlists/${playlistId}/tracks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracks: trackIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reorder tracks');
      }

      return true;
    } catch (err) {
      console.error('Error reordering tracks:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder tracks');
      return false;
    }
  }, [session?.user?.email]);

  const value: PlaylistContextType = {
    playlists,
    isLoading,
    error,
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylistById,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
