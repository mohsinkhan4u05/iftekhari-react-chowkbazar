import { CategoriesQueryOptionsType, Category } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchCategoriesBooks = async () => {
  const {
    data: { data },
  } = await http.get(API_ENDPOINTS.CATEGORY_BOOKS);
  return {
    categories: {
      data: data as Category[],
    },
  };
};

const fetchMockCategories = async () => {
  const {
    data: { data },
  } = await http.get(API_ENDPOINTS.CATEGORIES_ANCIENT);
  return {
    categories: {
      data: data as Category[],
    },
  };
};

export const useCategoriesBookQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORY_BOOKS, options],
    queryFn:
      options.demoVariant === "ancient"
        ? fetchMockCategories
        : fetchCategoriesBooks,
  });
};
