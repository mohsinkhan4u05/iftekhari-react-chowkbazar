import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

// Types
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  audioUrl?: string;
  cover?: string;
  coverImage?: string;
  albumId?: string;
  artistId?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  tracks: Track[];
  releaseDate: string;
  genre?: string;
}

export interface Artist {
  id: string;
  name: string;
  image?: string;
  bio?: string;
  albums: Album[];
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  cover?: string;
}

interface MusicPlayerState {
  currentTrack: Track | null;
  currentPlaylist: Track[];
  currentPlaylistName: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isLoading: boolean;
  currentIndex: number;
  playlists: Playlist[];
}

type MusicPlayerAction =
  | { type: 'PLAY_TRACK'; payload: { track: Track; playlist?: Track[]; playlistName?: string } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PLAYLIST'; payload: { tracks: Track[]; name: string } }
  | { type: 'ADD_TO_PLAYLIST'; payload: { playlistId: string; track: Track } }
  | { type: 'REMOVE_FROM_PLAYLIST'; payload: { playlistId: string; trackId: string } }
  | { type: 'CREATE_PLAYLIST'; payload: Playlist }
  | { type: 'DELETE_PLAYLIST'; payload: string }
  | { type: 'SET_PLAYLISTS'; payload: Playlist[] }
  | { type: 'UPDATE_PLAYLIST'; payload: Playlist };

const initialState: MusicPlayerState = {
  currentTrack: null,
  currentPlaylist: [],
  currentPlaylistName: '',
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  isLoading: false,
  currentIndex: 0,
  playlists: [],
};

function musicPlayerReducer(state: MusicPlayerState, action: MusicPlayerAction): MusicPlayerState {
  switch (action.type) {
    case 'PLAY_TRACK':
      const newPlaylist = action.payload.playlist || [action.payload.track];
      const newIndex = newPlaylist.findIndex(track => track.id === action.payload.track.id);
      return {
        ...state,
        currentTrack: action.payload.track,
        currentPlaylist: newPlaylist,
        currentPlaylistName: action.payload.playlistName || '',
        isPlaying: true,
        currentIndex: newIndex,
        isLoading: true,
      };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESUME':
      return { ...state, isPlaying: true };
    case 'STOP':
      return { ...state, isPlaying: false, currentTime: 0 };
    case 'NEXT_TRACK':
      if (state.currentPlaylist.length === 0) return state;
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.currentPlaylist.length) {
        nextIndex = state.repeatMode === 'all' ? 0 : state.currentIndex;
      }
      if (nextIndex !== state.currentIndex) {
        return {
          ...state,
          currentTrack: state.currentPlaylist[nextIndex],
          currentIndex: nextIndex,
          isLoading: true,
          currentTime: 0,
        };
      }
      return state;
    case 'PREVIOUS_TRACK':
      if (state.currentPlaylist.length === 0) return state;
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.repeatMode === 'all' ? state.currentPlaylist.length - 1 : 0;
      }
      if (prevIndex !== state.currentIndex) {
        return {
          ...state,
          currentTrack: state.currentPlaylist[prevIndex],
          currentIndex: prevIndex,
          isLoading: true,
          currentTime: 0,
        };
      }
      return state;
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffled: !state.isShuffled };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PLAYLIST':
      return {
        ...state,
        currentPlaylist: action.payload.tracks,
        currentPlaylistName: action.payload.name,
      };
    case 'CREATE_PLAYLIST':
      return {
        ...state,
        playlists: [...state.playlists, action.payload],
      };
    case 'DELETE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.filter(p => p.id !== action.payload),
      };
    case 'SET_PLAYLISTS':
      return {
        ...state,
        playlists: action.payload,
      };
    case 'UPDATE_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'ADD_TO_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p =>
          p.id === action.payload.playlistId
            ? { ...p, tracks: [...p.tracks, action.payload.track] }
            : p
        ),
      };
    case 'REMOVE_FROM_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p =>
          p.id === action.payload.playlistId
            ? { ...p, tracks: p.tracks.filter(t => t.id !== action.payload.trackId) }
            : p
        ),
      };
    default:
      return state;
  }
}

interface MusicPlayerContextType {
  state: MusicPlayerState;
  playTrack: (track: Track, playlist?: Track[], playlistName?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  setPlaylist: (tracks: Track[], name: string) => void;
  createPlaylist: (name: string, tracks?: Track[]) => void;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(musicPlayerReducer, initialState);
  const [mounted, setMounted] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Prevent hydration mismatch by only allowing audio features after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };

    const handleLoadedData = () => {
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch({ type: 'NEXT_TRACK' });
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.repeatMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    // Update audio source when track changes
    const audioUrl = state.currentTrack.audioUrl || state.currentTrack.url;
    if (audioUrl && audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load(); // Force reload of new source
    }

    if (state.isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio started playing successfully');
            dispatch({ type: 'SET_LOADING', payload: false });
          })
          .catch((error) => {
            console.error('Audio play failed:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'PAUSE' });
          });
      }
    } else {
      audio.pause();
    }
  }, [state.isPlaying, state.currentTrack]);

  const playTrack = (track: Track, playlist?: Track[], playlistName?: string) => {
    dispatch({ type: 'PLAY_TRACK', payload: { track, playlist, playlistName } });
  };

  const pause = () => dispatch({ type: 'PAUSE' });
  const resume = () => dispatch({ type: 'RESUME' });
  const stop = () => dispatch({ type: 'STOP' });
  const nextTrack = () => dispatch({ type: 'NEXT_TRACK' });
  const previousTrack = () => dispatch({ type: 'PREVIOUS_TRACK' });

  const setCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleMute = () => dispatch({ type: 'TOGGLE_MUTE' });
  const toggleShuffle = () => dispatch({ type: 'TOGGLE_SHUFFLE' });
  const setRepeatMode = (mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT_MODE', payload: mode });
  };

  const setPlaylist = (tracks: Track[], name: string) => {
    dispatch({ type: 'SET_PLAYLIST', payload: { tracks, name } });
  };

  const createPlaylist = (name: string, tracks: Track[] = []) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
    };
    dispatch({ type: 'CREATE_PLAYLIST', payload: newPlaylist });
  };

  const deletePlaylist = (playlistId: string) => {
    dispatch({ type: 'DELETE_PLAYLIST', payload: playlistId });
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    dispatch({ type: 'ADD_TO_PLAYLIST', payload: { playlistId, track } });
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    dispatch({ type: 'REMOVE_FROM_PLAYLIST', payload: { playlistId, trackId } });
  };

  const value = {
    state,
    playTrack,
    pause,
    resume,
    stop,
    nextTrack,
    previousTrack,
    setCurrentTime,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    setPlaylist,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    audioRef,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={state.currentTrack?.audioUrl || state.currentTrack?.url} preload="metadata" />
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

