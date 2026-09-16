import { computed, type Ref, type ComputedRef } from 'vue';
import { useApi } from './useApi'

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    brand?: string;
    category: string;
    thumbnail: string;
    images?: string[];
}

export type Products = Product[]

export interface ProductsResponse {
    products: Products;
    total: number;
    skip: number;
    limit: number;
}

export interface UseGetProductsOptions {
    searchQuery?: Ref<string> | ComputedRef<string>;
    category?: Ref<string | null> | ComputedRef<string | null>;
    perPage?: number;
}

export const useGetProducts = (options: UseGetProductsOptions = {}) => {
    const endpoint = computed(() => {
        const query = options.searchQuery?.value?.trim()
        if (query) {
            return `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
        }
        const cat = options.category?.value?.trim()
        if (cat) {
            return `https://dummyjson.com/products/category/${encodeURIComponent(cat)}`
        }
        return 'https://dummyjson.com/products'
    })

    const {
        data,
        isLoading: productsIsLoading,
        error: productsHasError,
        execute: fetchProducts,
        page: productsCurrentPage,
        perPage: productsPerPage,
        total: productsTotal,
        totalPages: productsTotalPages,
        hasNext: productsHasNext,
        hasPrev: productsHasPrev,
        nextPage: productsNextPage,
        prevPage: productsPrevPage,
        setPage: productsSetPage
    } = useApi<ProductsResponse | null>(endpoint, {
        initialData: null,
        immediate: true,
        pagination: true,
        perPage: options.perPage ?? 9
    })

    const products = computed(() => data.value?.products ?? [])

    return {
        products,
        productsIsLoading,
        productsHasError,
        fetchProducts,
        productsCurrentPage,
        productsPerPage,
        productsTotal,
        productsTotalPages,
        productsHasNext,
        productsHasPrev,
        productsNextPage,
        productsPrevPage,
        productsSetPage
    }
}