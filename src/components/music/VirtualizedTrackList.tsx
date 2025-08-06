import React, { useCallback, useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import TrackCard from "@components/music/track-card";
import { Track } from "@contexts/music-player.context";

interface VirtualizedTrackListProps {
  tracks: Track[];
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
  playlistName?: string;
  height?: number;
  itemHeight?: number;
}

const VirtualizedTrackList: React.FC<VirtualizedTrackListProps> = ({
  tracks,
  hasNextPage,
  loading,
  onLoadMore,
  playlistName = "All Tracks",
  height = 600,
  itemHeight = 80,
}) => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const isItemLoaded = useCallback(
    (index: number) => !hasNextPage || index < tracks.length,
    [hasNextPage, tracks.length]
  );

  const loadMoreItems = useCallback(() => {
    if (!loading && hasNextPage) {
      onLoadMore();
    }
  }, [loading, hasNextPage, onLoadMore]);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const track = tracks[index];
      if (!track) {
        return (
          <div
            style={style}
            className="flex justify-center items-center text-gray-500"
          >
            {loading ? "Loading..." : "No more tracks"}
          </div>
        );
      }

      return (
        <div style={style} className="px-2">
          <TrackCard
            track={track}
            playlist={tracks}
            playlistName={playlistName}
            index={index}
          />
        </div>
      );
    },
    [tracks, playlistName, loading]
  );

  const itemCount = hasNextPage ? tracks.length + 1 : tracks.length;

  // Return placeholder while mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className="flex justify-center items-center text-gray-500"
        style={{ height }}
      >
        <div className="animate-pulse">Loading tracks...</div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div 
        className="flex justify-center items-center text-gray-500"
        style={{ height }}
      >
        No tracks available
      </div>
    );
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          ref={ref}
          height={height}
          itemCount={itemCount}
          itemSize={itemHeight}
          onItemsRendered={onItemsRendered}
          width="100%"
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default VirtualizedTrackList;
