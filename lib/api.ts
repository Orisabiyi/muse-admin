import { Params } from "@/types/api-types";
import { Product } from "@/types/product";
import axios from "axios";

const baseUrl = process.env.MUSE_BASE_URL

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

  createNewProduct: async (product: Omit<Product, 'id'>) => {
    const { data } = await api.post<Product>('/products', product)

    return data
  },

  updateExistingProduct: async (id: string, product: Omit<Product, 'id'>) => {
    const { data } = await api.put<Product>(`/products/${id}`, product)

    return data
  },

  deleteProduct: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`)

    return data
  }
}