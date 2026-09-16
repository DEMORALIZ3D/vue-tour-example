import { computed } from 'vue'
import { useApi } from './useApi'

export interface ProductCategory {
  slug: string
  name: string
  url: string
}

export type ProductCategories = ProductCategory[]

export const useGetProductCategories = () => {
  const {
    data: categories,
    isLoading,
    error: hasError,
    execute: fetchCategories
  } = useApi<ProductCategories>('https://dummyjson.com/products/categories', {
    initialData: [],
    immediate: true
  })

  // Computed derivations remain purely reactive
  const totalCategories = computed(() => categories.value.length)

  return {
    categories,
    totalCategories,
    isLoading,
    hasError,
    fetchCategories
  }
}