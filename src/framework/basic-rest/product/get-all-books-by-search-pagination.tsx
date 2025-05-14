import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import shuffle from "lodash/shuffle";
import { QueryOptionsType, Book } from "@framework/types";

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
  const url = `${API_ENDPOINTS.BOOKS_SEARCH}?categories=${encodeURIComponent(
    categoryParam
  )}&page=${page}&pageSize=${pageSize}`;
  const { data } = await http.get(url);
  return {
    ...data,
    data: shuffle(data.data), // Shuffle only if needed
  };
};

// type UseBookBySearchQueryOptions = {
//   categories?: string[];
//   page?: number;
//   pageSize?: number;
// };

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
    queryKey: ["books", categories, page, pageSize],
    queryFn: () => fetchAllBooks(categories, page, pageSize),
    staleTime: 1000 * 60 * 5,
  });
};
