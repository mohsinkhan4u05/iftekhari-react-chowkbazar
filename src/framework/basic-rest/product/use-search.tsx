import { Product } from "@framework/types";
import http from "@framework/utils/http";
//import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchSearchedProducts = async (searchTerm: string) => {
  if (!searchTerm) return []; // do not fetch on empty search
  const url = "/books/global-search";
  const { data } = await http.get(`${url}?q=${searchTerm}`);
  return data;
};

export const useSearchQuery = (searchTerm: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["/books/global-search", searchTerm],
    queryFn: () => fetchSearchedProducts(searchTerm),
    enabled: !!searchTerm,
    staleTime: 60 * 1000,
  });
};
