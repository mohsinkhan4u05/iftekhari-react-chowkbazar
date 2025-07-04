import React from "react";
import Link from "next/link";
import { useUI } from "@contexts/ui.context";
import { Book } from "@framework/types";
import { formatBookTitle } from "@utils/text-formatting";
import OptimizedBookmarkButton from "@components/ui/optimized-bookmark-button";

interface ModernBookCardProps {
  book: Book;
  className?: string;
}

const ModernBookCard: React.FC<ModernBookCardProps> = ({ book, className = "" }) => {
  const { openModal, setModalView, setModalData } = useUI();
  const placeholderImage = `https://admin.silsilaeiftekhari.in/${book?.ImagePath}`;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalData({ data: book });
    setModalView("PRODUCT_VIEW");
    openModal();
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 ${className}`}>
      <Link href={`/books/${book.Slug}/${book.ID}`}>
        {/* Book Cover */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={book.image?.thumbnail || placeholderImage}
            alt={book.Name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/assets/images/placeholder.png";
            }}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          
          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-gray-50"
          >
            Quick View
          </button>
          
          {/* Bookmark Button */}
          <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
            <OptimizedBookmarkButton bookId={book.ID} />
          </div>
          
          {/* New Badge */}
          {book.isNewArrival && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
              New
            </div>
          )}
        </div>

        {/* Book Information */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {formatBookTitle(truncateText(book.Name, 60))}
          </h3>

          {/* Author */}
          {book.Author && (
            <p className="text-xs text-gray-600 truncate">
              by {truncateText(book.Author, 30)}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {/* Language */}
              {book.Language && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{book.Language}</span>
                </div>
              )}
              
              {/* Pages */}
              {book.TotalPages && (
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{book.TotalPages}p</span>
                </div>
              )}
            </div>

            {/* Views */}
            {book.Views && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{book.Views}</span>
              </div>
            )}
          </div>

          {/* Category Tag */}
          {book.CategoryName && (
            <div className="pt-1">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium">
                {book.CategoryName}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ModernBookCard;
