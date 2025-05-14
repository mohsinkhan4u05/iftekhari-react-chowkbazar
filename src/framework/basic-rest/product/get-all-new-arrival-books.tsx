import { QueryOptionsType, Book } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchNewArrivalBooks = async ({ queryKey }: any) => {
  const [_key, options] = queryKey;
  const { limit, type } = options;
  const { data } = await http.get(
    `${API_ENDPOINTS.BOOKS}?limit=${limit}&type=${type}`
  );
  return data as Book[];
};

export const useNewArrivalBooksQuery = (options: QueryOptionsType) => {
  return useQuery<Book[], Error>({
    queryKey: [API_ENDPOINTS.BOOKS, options],
    queryFn: fetchNewArrivalBooks,
  });
};
