import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchNewArrivalProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.BOOKS);
  return data as Product[];
};

const fetchNewArrivalAncientProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.NEW_ARRIVAL_PRODUCTS_ANCIENT);
  return data as Product[];
};

export const useNewArrivalProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey:
      options.demoVariant === "ancient"
        ? [API_ENDPOINTS.NEW_ARRIVAL_PRODUCTS_ANCIENT, options]
        : [API_ENDPOINTS.PRODUCTS_ANCIENT, options],
    queryFn:
      options.demoVariant === "ancient"
        ? fetchNewArrivalAncientProducts
        : fetchNewArrivalProducts,
  });
};
