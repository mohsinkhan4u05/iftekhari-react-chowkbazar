import { QueryOptionsType } from "@framework/types";
import http from "@framework/utils/http";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { useQuery } from "@tanstack/react-query";

export const fetchFlashSaleProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.FLASH_SALE_PRODUCTS);
  return data;
};

const fetchAncientFlashSaleProducts = async () => {
  const { data } = await http.get(API_ENDPOINTS.FLASH_SALE_PRODUCTS_ANCIENT);
  return data;
};

export const useFlashSaleProductsQuery = (options: QueryOptionsType) => {
  return useQuery<any, Error>({
    queryKey:
      options.demoVariant === "ancient"
        ? [API_ENDPOINTS.FLASH_SALE_PRODUCTS_ANCIENT, options]
        : [API_ENDPOINTS.FLASH_SALE_PRODUCTS, options],
    queryFn:
      options.demoVariant === "ancient"
        ? fetchAncientFlashSaleProducts
        : fetchFlashSaleProducts,
  });
};
