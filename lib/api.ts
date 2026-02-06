import { Params } from "@/types/api-types";
import { Product } from "@/types/product";
import axios from "axios";
import { ProductFormValues } from "./validations";

const baseUrl = process.env.NEXT_PUBLIC_MUSE_BASE_URL



const api = axios.create({
  baseURL: baseUrl,
})

export const productApi = {
  getAllProducts: async (page: number = 1, limit: number = 10, search?: string) => {
    const params: Params = {
      page,
      limit,
      ...(search ? { search } : {}),
    }

    const { data } = await api.get<Product[]>('/products', { params })

    return data
  },

  getProductById: async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`)

    return data
  },

  createNewProduct: async (product: ProductFormValues) => {
    const payload = {
      ...product,
      price: product.price.toString(),
    };

    const { data } = await api.post<Product>('/products', payload)

    return data
  },

  updateExistingProduct: async (id: string, product: ProductFormValues) => {
    const payload = {
      ...product,
      price: product.price.toString(),
    };

    const { data } = await api.put<Product>(`/products/${id}`, payload)

    return data
  },

  deleteProduct: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`)

    return data
  }
}