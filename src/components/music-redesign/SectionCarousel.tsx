import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Item {
  id: string | number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

interface SectionCarouselProps {
  title: string;
  items: Item[];
  onItemClick?: (id: string | number) => void;
}

const SectionCarousel: React.FC<SectionCarouselProps> = ({
  title,
  items,
  onItemClick,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-2 px-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Scrollable Items */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scrollbar-hide px-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-40 flex-shrink-0 cursor-pointer"
            onClick={() => onItemClick?.(item.id)}
          >
            <div className="w-40 h-40 bg-gray-200 rounded-lg overflow-hidden shadow">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  🎵
                </div>
              )}
            </div>
            <p className="mt-2 text-sm font-medium truncate">{item.title}</p>
            {item.subtitle && (
              <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCarousel;
