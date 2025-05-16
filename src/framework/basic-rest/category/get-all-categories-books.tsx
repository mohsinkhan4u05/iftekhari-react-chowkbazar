import { CategoriesQueryOptionsType, Category } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchCategoriesBooks = async () => {
  const response = await http.get(API_ENDPOINTS.CATEGORY_BOOKS);
  const categories = response.data.data; // ✅ this is the array you want
  return {
    categories: {
      data: categories as Category[],
    },
  };
};

export const useCategoriesBookQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORY_BOOKS, options],
    queryFn: fetchCategoriesBooks,
  });
};
