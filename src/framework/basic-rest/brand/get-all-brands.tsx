import { QueryOptionsType, Brand } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchBrands = async () => {
  const { data } = await http.get(API_ENDPOINTS.BRANDS);
  return data;
};
const fetchAncientBrands = async () => {
  const { data } = await http.get(API_ENDPOINTS.BRANDS_ANCIENT);
  return data;
};

export const useBrandsQuery = (options: QueryOptionsType) => {
  return useQuery<
    { brands: Brand[]; brandsGrid: Brand[]; brandsTimer: Brand[] },
    Error
  >({
    queryKey:
      options.demoVariant === "ancient"
        ? [API_ENDPOINTS.BRANDS_ANCIENT, options]
        : [API_ENDPOINTS.BRANDS, options],
    queryFn:
      options.demoVariant === "ancient" ? fetchAncientBrands : fetchBrands,
  });
};
