import React, { useCallback } from "react";
// @ts-ignore
import { FixedSizeList as List } from "react-window";
// @ts-ignore
import InfiniteLoader from "react-window-infinite-loader";
import TrackCard from "./track-card";
import { Track } from "@contexts/music-player.context";

interface VirtualizedTrackListProps {
  tracks: Track[];
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
  playlistName?: string;
  height?: number;
  itemHeight?: number;
  onAddToPlaylist?: (track: Track) => void;
}

const VirtualizedTrackList: React.FC<VirtualizedTrackListProps> = ({
  tracks,
  hasNextPage,
  loading,
  onLoadMore,
  playlistName = "All Tracks",
  height = 600,
  itemHeight = 56,
  onAddToPlaylist,
}) => {
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
        <div
          style={{ ...style, contain: "layout style paint" }}
          className="hover:z-10 relative"
          onMouseEnter={(e) => {
            // Ensure the event reaches the TrackCard
            const trackCard = e.currentTarget.querySelector(".group");
            if (trackCard) {
              const mouseEnterEvent = new MouseEvent("mouseenter", {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 0,
                screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX,
                clientY: e.clientY,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey,
                button: e.button,
                buttons: e.buttons,
                relatedTarget: e.relatedTarget,
              });
              trackCard.dispatchEvent(mouseEnterEvent);
            }
          }}
          onMouseLeave={(e) => {
            // Ensure the event reaches the TrackCard
            const trackCard = e.currentTarget.querySelector(".group");
            if (trackCard) {
              const mouseLeaveEvent = new MouseEvent("mouseleave", {
                bubbles: true,
                cancelable: true,
                view: window,
                detail: 0,
                screenX: e.screenX,
                screenY: e.screenY,
                clientX: e.clientX,
                clientY: e.clientY,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey,
                button: e.button,
                buttons: e.buttons,
                relatedTarget: e.relatedTarget,
              });
              trackCard.dispatchEvent(mouseLeaveEvent);
            }
          }}
        >
          <TrackCard
            track={track}
            index={index}
            playlist={tracks}
            playlistName={playlistName}
            onAddToPlaylist={onAddToPlaylist}
          />
        </div>
      );
    },
    [tracks, playlistName, loading]
  );

  const itemCount = hasNextPage ? tracks.length + 1 : tracks.length;

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
      {({ onItemsRendered, ref }: { onItemsRendered: any; ref: any }) => (
        <List
          ref={ref}
          height={height}
          itemCount={itemCount}
          itemSize={itemHeight}
          onItemsRendered={onItemsRendered}
          width="100%"
          className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 w-full"
          style={{
            contain: "layout style paint",
            overflow: "visible",
            position: "relative",
            zIndex: 0,
          }}
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default VirtualizedTrackList;
