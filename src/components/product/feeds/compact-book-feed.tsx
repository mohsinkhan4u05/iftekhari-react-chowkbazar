import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useNewArrivalBooksQuery } from "@framework/product/get-all-new-arrival-books";
import { ROUTES } from "@utils/routes";
import { Book } from "@framework/types";
import { formatBookTitle } from "@utils/text-formatting";

interface CompactBookFeedProps {
  className?: string;
  type?: string;
  limit?: number;
  sectionHeading?: string;
  showViewAll?: boolean;
}

const CompactBookFeed: React.FC<CompactBookFeedProps> = ({
  className = "mb-7 md:mb-10 lg:mb-12 xl:mb-14 2xl:mb-[75px]",
  type = "popular",
  limit = 10,
  sectionHeading = "Popular Books",
  showViewAll = true,
}) => {
  const { data, isLoading, error } = useNewArrivalBooksQuery({
    limit,
    type,
  });

  const books = data || [];
  
  // Add test data if no books are loaded for debugging
  const testBooks = books.length === 0 ? [
    { ID: 1, Name: 'Test Book 1', Author: 'Author 1', ImagePath: '', Views: 100, TotalPages: 200, price: 10 },
    { ID: 2, Name: 'Test Book 2', Author: 'Author 2', ImagePath: '', Views: 150, TotalPages: 250, price: 15 },
    { ID: 3, Name: 'Test Book 3', Author: 'Author 3', ImagePath: '', Views: 120, TotalPages: 180, price: 12 },
    { ID: 4, Name: 'Test Book 4', Author: 'Author 4', ImagePath: '', Views: 200, TotalPages: 300, price: 20 },
    { ID: 5, Name: 'Test Book 5', Author: 'Author 5', ImagePath: '', Views: 80, TotalPages: 160, price: 8 },
    { ID: 6, Name: 'Test Book 6', Author: 'Author 6', ImagePath: '', Views: 90, TotalPages: 170, price: 9 },
    { ID: 7, Name: 'Test Book 7', Author: 'Author 7', ImagePath: '', Views: 110, TotalPages: 190, price: 11 },
    { ID: 8, Name: 'Test Book 8', Author: 'Author 8', ImagePath: '', Views: 130, TotalPages: 210, price: 13 },
  ] : books;
  
  const displayBooks = testBooks;
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  // Handle mouse wheel for horizontal scrolling on desktop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent vertical scrolling when over the container
      e.preventDefault();
      // Scroll horizontally using deltaY (wheel up/down)
      scrollContainer.scrollLeft += e.deltaY;
    };

    // Add event listener with passive: false to allow preventDefault
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup event listener on unmount
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className={className}>
      {/* CSS for hiding scrollbars */}
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          display: none;
        }
        .scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-heading">{sectionHeading}</h2>
        
        <div className="flex items-center gap-3">
          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {showViewAll && (
            <Link
              href={ROUTES.BOOK}
              className="inline-flex items-center text-sm text-gray-600 hover:text-heading transition-colors duration-200"
            >
              View All
              <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Books Horizontal Scroll */}
      {error ? (
        <div className="text-center py-8 text-red-500">
          <p>Error loading books. Please try again later.</p>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="scroll-container flex flex-nowrap gap-4 overflow-x-auto overflow-y-hidden pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {isLoading ? (
              // Compact Loading skeleton
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex-shrink-0 w-40 animate-pulse">
                  <div className="bg-gray-200 rounded-lg w-40 h-52 mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded mb-2 w-24"></div>
                  <div className="bg-gray-200 h-4 rounded w-16"></div>
                </div>
              ))
            ) : (
              displayBooks.map((book: any) => (
                <Link
                  key={book.ID}
                  href={`/books/${book.Slug}/${book.ID}`}
                  className="flex-shrink-0 group w-40 hover:scale-105 transition-transform duration-200"
                >
                  {/* Book Cover */}
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 w-40 h-52 mb-3 group-hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={book.image?.thumbnail || `https://admin.silsilaeiftekhari.in/${book.ImagePath}`}
                      alt={book.Name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/images/placeholder.png";
                      }}
                    />
                    
                    {/* Badge for new arrivals */}
                    {book.isNewArrival && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                        New
                      </div>
                    )}
                    
                    {/* Price badge */}
                    {book.price && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md font-medium">
                        {formatPrice(book.sale_price || book.price)}
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-heading line-clamp-2 group-hover:text-accent transition-colors leading-tight">
                      {formatBookTitle(truncateText(book.Name, 50))}
                    </h3>
                    
                    {book.Author && (
                      <p className="text-xs text-gray-600 truncate">
                        by {truncateText(book.Author, 25)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {book.Views && (
                        <span className="flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {book.Views}
                        </span>
                      )}
                      
                      {book.TotalPages && (
                        <span className="text-xs text-gray-500">
                          {book.TotalPages}p
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactBookFeed;
