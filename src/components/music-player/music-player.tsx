import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '@contexts/music-player.context';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeDown, 
  FaVolumeMute,
  FaRandom,
  FaRedo,
  FaHeart,
  FaListUl
} from 'react-icons/fa';

const MusicPlayer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const {
    state,
    playTrack,
    pause,
    resume,
    nextTrack,
    previousTrack,
    setCurrentTime,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode
  } = useMusicPlayer();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * state.duration;
    setCurrentTime(newTime);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * state.duration;
    if (newTime >= 0 && newTime <= state.duration) {
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse up listener to handle dragging outside the progress bar
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value) / 100);
  };

  const getRepeatIcon = () => {
    switch (state.repeatMode) {
      case 'one':
        return <FaRedo className="text-blue-500" />;
      case 'all':
        return <FaRedo className="text-green-500" />;
      default:
        return <FaRedo className="text-gray-400" />;
    }
  };

  const handleRepeatClick = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  if (!state.currentTrack) {
    return null;
  }

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50">
      {/* Interactive Progress Bar - Full Width at Top */}
      <div className="w-full h-1 bg-gray-200 cursor-pointer group hover:h-2 transition-all duration-200"
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const clickX = e.clientX - rect.left;
             const percentage = (clickX / rect.width) * 100;
             const newTime = (percentage / 100) * state.duration;
             setCurrentTime(newTime);
           }}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 relative"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Progress thumb - only visible on hover */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between space-x-2">
          {/* Track Info - Mobile */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {/* Album Art - Smaller on mobile */}
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md flex-shrink-0">
              {(state.currentTrack.cover || state.currentTrack.coverImage) ? (
                <img
                  src={state.currentTrack.cover || state.currentTrack.coverImage}
                  alt={state.currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              
              <div 
                className={`absolute inset-0 flex items-center justify-center ${
                  (state.currentTrack.cover || state.currentTrack.coverImage) ? 'hidden' : 'flex'
                }`}
              >
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Track Details - Mobile */}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-gray-900 truncate leading-tight">
                {state.currentTrack.title}
              </h4>
              <p className="text-xs text-gray-600 truncate">
                {state.currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Mobile Controls - Simplified */}
          <div className="flex items-center space-x-1">
            <button
              onClick={previousTrack}
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="Previous"
            >
              <FaStepBackward size={14} />
            </button>
            
            <button
              onClick={state.isPlaying ? pause : resume}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              disabled={state.isLoading}
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isLoading ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : state.isPlaying ? (
                <FaPause size={14} />
              ) : (
                <FaPlay size={14} className="ml-0.5" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="Next"
            >
              <FaStepForward size={14} />
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Track Info - Desktop */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Album Art */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md flex-shrink-0">
              {(state.currentTrack.cover || state.currentTrack.coverImage) ? (
                <img
                  src={state.currentTrack.cover || state.currentTrack.coverImage}
                  alt={state.currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              
              <div 
                className={`absolute inset-0 flex items-center justify-center ${
                  (state.currentTrack.cover || state.currentTrack.coverImage) ? 'hidden' : 'flex'
                }`}
              >
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Track Details - Desktop */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate leading-tight">
                {state.currentTrack.title}
              </h4>
              <p className="text-xs text-gray-600 truncate">
                {state.currentTrack.artist}
              </p>
              {state.currentPlaylistName && (
                <p className="text-xs text-gray-500 truncate">
                  from {state.currentPlaylistName}
                </p>
              )}
            </div>
          </div>

          {/* Main Controls - Desktop */}
          <div className="flex items-center space-x-2 mx-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                state.isShuffled ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
              }`}
              title="Shuffle"
            >
              <FaRandom size={14} />
            </button>
            
            <button
              onClick={previousTrack}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="Previous"
            >
              <FaStepBackward size={16} />
            </button>
            
            <button
              onClick={state.isPlaying ? pause : resume}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={state.isLoading}
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : state.isPlaying ? (
                <FaPause size={16} />
              ) : (
                <FaPlay size={16} className="ml-0.5" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
              title="Next"
            >
              <FaStepForward size={16} />
            </button>
            
            <button
              onClick={handleRepeatClick}
              className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                state.repeatMode === 'one' ? 'text-orange-600 bg-orange-50' :
                state.repeatMode === 'all' ? 'text-green-600 bg-green-50' : 'text-gray-500'
              }`}
              title={`Repeat: ${state.repeatMode}`}
            >
              <FaRedo size={14} />
            </button>
          </div>

          {/* Time Display & Volume - Desktop */}
          <div className="flex items-center space-x-3 flex-1 justify-end min-w-0">
            {/* Time Display */}
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="font-mono">{formatTime(state.currentTime)}</span>
              <span>/</span>
              <span className="font-mono">{formatTime(state.duration)}</span>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
                title={state.isMuted ? 'Unmute' : 'Mute'}
              >
                {state.isMuted || state.volume === 0 ? (
                  <FaVolumeMute size={14} />
                ) : state.volume < 0.5 ? (
                  <FaVolumeDown size={14} />
                ) : (
                  <FaVolumeUp size={14} />
                )}
              </button>
              
              <div className="w-20">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.isMuted ? 0 : state.volume * 100}
                  onChange={handleVolumeChange}
                  className="volume-slider w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .volume-slider {
          background: linear-gradient(to right, #6366f1 0%, #6366f1 ${state.isMuted ? 0 : state.volume * 100}%, #d1d5db ${state.isMuted ? 0 : state.volume * 100}%, #d1d5db 100%);
        }
        
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .volume-slider::-moz-range-thumb {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .progress-bar {
          background: linear-gradient(to right, #3b82f6 0%, #8b5cf6 100%);
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
