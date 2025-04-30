import { QueryOptionsType, Product } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchFeaturedProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.FEATURED_PRODUCTS);
  return data as Product[];
};

const fetchAncientFeaturedProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.FEATURED_PRODUCTS_ANCIENT);
  return data as Product[];
};

export const useFeaturedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>({
    queryKey:
      options.demoVariant === "ancient"
        ? [API_ENDPOINTS.FEATURED_PRODUCTS, options]
        : [API_ENDPOINTS.FEATURED_PRODUCTS, options],
    queryFn:
      options.demoVariant === "ancient"
        ? fetchAncientFeaturedProducts
        : fetchFeaturedProducts,
  });
};
