import { usePaginatedBooksQuery } from "@framework/product/get-all-books-by-search-pagination";
import { useState, useEffect } from "react";
import Pagination from "@components/common/pagination"; // you will build this
import { useBookCount } from "@contexts/book/book-count.context";
import BookCard from "@components/product/book-card";
import type { FC } from "react";
import { useRouter } from "next/router";
import ProductFeedLoader from "@components/ui/loaders/product-feed-loader";

interface ProductGridProps {
  className?: string;
}

export const BookSearchGridPagination: FC<ProductGridProps> = ({
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { query } = useRouter();
  const category = query.category?.toString() || "";
  const language = query.language?.toString() || "";
  const { setCount } = useBookCount();

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
    pageSize: 10,
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

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 ... ${className}`}
      >
        {isLoading ? (
          <ProductFeedLoader limit={10} uniqueKey="book-grid" />
        ) : (
          data?.data?.map((book) => (
            <BookCard key={book.ID} product={book} variant="grid" />
          ))
        )}
      </div>

      <div className="text-center pt-8">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data?.pagination?.totalPages ?? 1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </>
  );
};
