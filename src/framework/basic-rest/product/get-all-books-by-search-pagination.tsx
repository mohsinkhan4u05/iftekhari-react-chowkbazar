import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import http from "@framework/utils/http";
import { Book } from "@framework/types";
// import shuffle from "lodash/shuffle"; // Optional if you need random order

export type BookResponse = {
  data: Book[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalBooks: number;
    totalPages: number;
    hasMorePages: boolean;
    nextPage: number | null;
  };
};

const fetchAllBooks = async (
  categories: string[] = [],
  page = 1,
  pageSize = 10
): Promise<BookResponse> => {
  const categoryParam = categories.join(",");
  const url = `/books/search?categories=${encodeURIComponent(
    categoryParam
  )}&page=${page}&pageSize=${pageSize}`;

  const response = await http.get(url);
  const { data, success, pagination, message } = response.data;

  // const normalizedBooks = data.map((book: any) => ({
  //   id: book.Id,
  //   name: book.Name,
  //   slug: book.Slug,
  //   image: book.Image,
  //   categoryId: book.CategoryId,
  //   // add others as needed
  // }));

  // if (!success) {
  //   throw new Error(message || "Failed to fetch books");
  // }

  return {
    data: data, // or shuffle(data) if needed
    pagination,
  };
};

export const usePaginatedBooksQuery = ({
  categories = [],
  page = 1,
  pageSize = 10,
}: {
  categories: string[];
  page?: number;
  pageSize?: number;
}) => {
  return useQuery<BookResponse, Error>({
    //queryKey: ["books", categories, page, pageSize],
    queryKey: [
      "/books/search?categories",
      categories.join(","),
      page,
      pageSize,
    ],
    queryFn: () => fetchAllBooks(categories, page, pageSize),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
