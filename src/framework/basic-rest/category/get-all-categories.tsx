import { CategoriesQueryOptionsType, Category } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchCategories = async () => {
  const {
    data: { data },
  } = await http.get(API_ENDPOINTS.CATEGORY_BOOKS);
  return {
    categories: {
      data: data as Category[],
    },
  };
};

const fetchAncientCategories = async () => {
  const {
    data: { data },
  } = await http.get(API_ENDPOINTS.CATEGORY_BOOKS);
  return {
    categories: {
      data: data as Category[],
    },
  };
};

export const useCategoriesQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>({
    queryKey: [API_ENDPOINTS.CATEGORY_BOOKS, options],
    queryFn:
      options.demoVariant === "ancient"
        ? fetchAncientCategories
        : fetchCategories,
  });
};
