// hooks/use-search.ts
import { Product } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

export const fetchSearchedProducts = async ({ queryKey }: any) => {
  const [_key, searchTerm] = queryKey;

  if (!searchTerm) return [];

  const url = `/api/books/global-search?q=${encodeURIComponent(searchTerm)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = await res.json();
  return data as Product[];
};

export const useSearchQuery = (searchTerm: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["/api/books/global-search", searchTerm],
    queryFn: fetchSearchedProducts,
    enabled: !!searchTerm,
    staleTime: 60 * 1000,
  });
};
