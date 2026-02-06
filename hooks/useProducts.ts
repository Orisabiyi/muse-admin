import { productApi } from "@/lib/api"
import { queryClient } from "@/lib/query-client"
import { ProductFormValues } from "@/lib/validations"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetAllProducts = (page: number = 1, limit: number = 10, search?: string) => {
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

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (data: ProductFormValues) => productApi.createNewProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success('Product created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create product');
    }
  })
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => productApi.updateExistingProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success('Product updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update product');
    }
  })
}

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success('Product deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete product');
    }
  })
}
