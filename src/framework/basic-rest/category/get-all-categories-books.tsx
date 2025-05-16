import { CategoriesQueryOptionsType, Category } from "@framework/types";
import http from "@framework/utils/http";
import { useQuery } from "@tanstack/react-query";

export const fetchCategoriesBooks = async () => {
  const url = `/api/categories/list`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response = await res.json();
  const categories = response.data; // ✅ this is the array you want
  return {
    categories: {
      data: categories as Category[],
    },
  };
};

export const useCategoriesBookQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ categories: { data: Category[] } }, Error>({
    queryKey: ["/api/categories/list", options],
    queryFn: fetchCategoriesBooks,
  });
};
