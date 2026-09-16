import { computed } from 'vue';
import { useApi } from './useApi'

export interface Product {
    id: number;
    title: string;
    price: number;
}

export type Products = Product[]


export interface ProductsResponse {
    products: Products;
    total: number;
    skip: number;
    limit: number;
}


export const useGetProducts = () => {
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
        prevPage: productsPrevPage
    } = useApi<ProductsResponse | null>('https://dummyjson.com/products', {
        initialData: null,
        immediate: true,
        pagination: true,
    })

    const products = computed(() => data.value?.products ?? [])

    return {
        products: products,
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
        productsPrevPage
    }
}