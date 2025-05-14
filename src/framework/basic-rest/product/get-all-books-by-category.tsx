import { QueryOptionsType, Book } from "@framework/types";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import shuffle from "lodash/shuffle";
import { useInfiniteQuery } from "@tanstack/react-query";
type PaginatedProduct = {
  data: Book[];
  paginatorInfo: any;
};

const fetchBooks = async ({ queryKey, pageParam = 1 }: any) => {
  const [_key, options] = queryKey;
  const { id } = options;

  const { data } = await http.get(
    `${API_ENDPOINTS.BOOKS_BY_CATEGORY}/${id}?page=${pageParam}&pageSize=10`
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

const useBookByCategoryQuery = (options: QueryOptionsType & { id: number }) => {
  return useInfiniteQuery<PaginatedProduct, Error>({
    queryKey: [API_ENDPOINTS.BOOKS_BY_CATEGORY, options],
    queryFn: fetchBooks,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.paginatorInfo.nextPage,
  });
};

export { useBookByCategoryQuery, fetchBooks };
