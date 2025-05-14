import { QueryOptionsType, Book } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import shuffle from "lodash/shuffle";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
type PaginatedProduct = {
  data: Book[];
  paginatorInfo: any;
};

const fetchBooksByType = async ({ queryKey, pageParam = 1 }: any) => {
  const [_key, options] = queryKey;
  const { popular, editorChoice } = options;

  const { data } = await http.get(
    `${API_ENDPOINTS.BOOKS_BY_TYPE}/${popular}/${editorChoice}?page=${pageParam}&pageSize=10`
  );

  return {
    data: shuffle(data.data),
    paginatorInfo: {
      nextPage: data.pagination.hasMorePages
        ? data.pagination.nextPage
        : undefined,
    },
  };
};

const fetchBooksByTypeFeed = async ({ queryKey, pageParam = 1 }: any) => {
  // const [_key, options] = queryKey;
  // const { popular, editorChoice } = options;
  const { data } = await http.get(`${API_ENDPOINTS.BOOKS_BY_TYPE}`);
  return data as Book[];
};

const useBookByTypeQuery = (
  options: QueryOptionsType & { popular?: boolean; editorChoice?: boolean }
) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: [API_ENDPOINTS.BOOKS_BY_TYPE, options],
    queryFn: fetchBooksByType,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPage,
  });
};

const useBookByTypeFeedQuery = (options: QueryOptionsType) => {
  return useQuery<Book[], Error>({
    queryKey: [API_ENDPOINTS.BOOKS_BY_TYPE, options],
    queryFn: fetchBooksByTypeFeed,
  });
};

export {
  useBookByTypeQuery,
  useBookByTypeFeedQuery,
  fetchBooksByType,
  fetchBooksByTypeFeed,
};
