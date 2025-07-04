import { CategoriesQueryOptionsType, Category } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

export const fetchLanguagesBooks = async () => {
  const url = `/api/languages/list`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch languages");
  }

  const response = await res.json();
  const languages = response.data; // ✅ this is the array you want
  return {
    languages: {
      data: languages as Category[],
    },
  };
};

export const useLanguagesBookQuery = (options: CategoriesQueryOptionsType) => {
  return useQuery<{ languages: { data: Category[] } }, Error>({
    queryKey: ["/api/languages/list", options],
    queryFn: fetchLanguagesBooks,
  });
};
