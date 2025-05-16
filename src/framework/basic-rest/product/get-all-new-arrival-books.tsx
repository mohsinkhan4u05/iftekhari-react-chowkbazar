import { QueryOptionsType, Book } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

export const fetchNewArrivalBooks = async ({ queryKey }: any) => {
  const [_key, options] = queryKey;
  const { limit = 10, type = "popular", offset = 0 } = options;

  const url = `/api/books/pagination?limit=${limit}&type=${type}&offset=${offset}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await res.json();
  return data as Book[];
};

export const useNewArrivalBooksQuery = (options: QueryOptionsType) => {
  return useQuery<Book[], Error>({
    queryKey: ["/api/books/pagination", options],
    queryFn: fetchNewArrivalBooks,
  });
};
