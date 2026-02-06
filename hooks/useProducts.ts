import { productApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useGetAllProducts = (page: number = 1, limit: number = 10, search: string) => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: async () => productApi.getAllProducts(page, limit, search),
  })
}

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => productApi.getProductById(id),
  })
}