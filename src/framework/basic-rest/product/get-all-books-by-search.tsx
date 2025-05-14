import { QueryOptionsType, Book } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import shuffle from "lodash/shuffle";
import { useInfiniteQuery } from "@tanstack/react-query";
type PaginatedProduct = {
  data: Book[];
  paginatorInfo: any;
};

const fetchAllBooks = async ({ queryKey, pageParam = 1 }: any) => {
  const [_key, options] = queryKey;
  const { category } = options;

  // If `category` is an array, convert to comma-separated string
  const categoryQuery = Array.isArray(category)
    ? category.map(encodeURIComponent).join("&categories=")
    : encodeURIComponent(category);

  const { data } = await http.get(
    `${API_ENDPOINTS.BOOKS_SEARCH}?${
      category ? `categories=${categoryQuery}&` : ""
    }page=${pageParam}&pageSize=10`
  );

  return {
    data: shuffle(data.data),
    paginatorInfo: {
      nextPage: data.pagination.hasMorePages
        ? data.pagination.nextPage
        : undefined,
      totalBooks: data.pagination.totalBooks,
    },
  };
};

const useBookBySearchQuery = (options: QueryOptionsType) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: [API_ENDPOINTS.BOOKS_SEARCH, options],
    queryFn: fetchAllBooks,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPage,
  });
};

export { useBookBySearchQuery, fetchAllBooks };
