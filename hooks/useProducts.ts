import { productApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useProducts = (page: number = 1, limit: number = 10, search: string) => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: async () => productApi.getAllProducts(page, limit, search),
  })
}