import { useQuery } from "@tanstack/react-query";
import { Book } from "@framework/types";

export type BookResponse = {
  data: Book[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalBooks: number;
    totalPages: number;
    hasMorePages: boolean;
    nextPage: number | null;
  };
};

const fetchAllBooks = async (
  categories: string[] = [],
  page = 1,
  pageSize = 10
): Promise<BookResponse> => {
  const categoryParam = categories.join(",");
  const url = `/api/books/search?categories=${encodeURIComponent(
    categoryParam
  )}&page=${page}&pageSize=${pageSize}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }
  const response = await res.json();
  const { data, success, pagination, message } = response;

  if (!success) {
    throw new Error(message || "Failed to fetch books");
  }

  return {
    data: data, // or shuffle(data) if needed
    pagination,
  };
};

export const usePaginatedBooksQuery = ({
  categories = [],
  page = 1,
  pageSize = 10,
}: {
  categories: string[];
  page?: number;
  pageSize?: number;
}) => {
  return useQuery<BookResponse, Error>({
    queryKey: [
      "/api/books/search?categories",
      categories.join(","),
      page,
      pageSize,
    ],
    queryFn: () => fetchAllBooks(categories, page, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
