import React from "react";
import { usePaginatedBooksQuery } from "@framework/product/get-all-books-by-search-pagination";
import { useRouter } from "next/router";
import { useBookCount } from "@contexts/book/book-count.context";
import { useBookmark } from "@contexts/bookmark/bookmark.context";
import ModernBookCard from "./modern-book-card";
import Pagination from "@components/common/pagination";
import { useState, useEffect, useRef } from "react";

interface ModernBooksGridProps {
  className?: string;
}

const ModernBooksGrid: React.FC<ModernBooksGridProps> = ({
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { query } = useRouter();
  const category = query.category?.toString() || "";
  const language = query.language?.toString() || "";
  const { setCount } = useBookCount();
  const { batchCheckBookmarks } = useBookmark();
  const processedPagesRef = useRef(new Set<string>());

  const categories = Array.isArray(category)
    ? category
    : category
    ? [category]
    : [];

  const languages = Array.isArray(language)
    ? language
    : language
    ? [language]
    : [];

  const { data, isLoading, error } = usePaginatedBooksQuery({
    categories,
    languages,
    page: currentPage,
    pageSize: 24, // Increased for better grid layout
  });

  const totalPages = data?.pagination?.totalPages ?? 0;

  useEffect(() => {
    if (data?.pagination?.totalBooks) {
      setCount(data.pagination.totalBooks);
    }
  }, [data, setCount]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, language]);

  // Batch check bookmarks when books are loaded
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      const bookIds = data.data.map(book => book.ID);
      const pageKey = `page_${currentPage}_${categories.join('_')}_${languages.join('_')}`;
      
      // Check if we've already processed this page to prevent infinite calls
      if (!processedPagesRef.current.has(pageKey)) {
        processedPagesRef.current.add(pageKey);
        batchCheckBookmarks(bookIds, pageKey);
      }
    }
  }, [data?.data, currentPage, categories.join('_'), languages.join('_')]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium mb-2">
          Something went wrong
        </div>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-[3/4] mb-4"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Books Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {data?.data?.map((book) => (
              <ModernBookCard key={book.ID} book={book} />
            ))}
          </div>

          {/* No Results */}
          {!isLoading && (!data?.data || data.data.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-8 md:pt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModernBooksGrid;
