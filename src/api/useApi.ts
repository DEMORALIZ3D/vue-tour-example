import { ref, computed, onMounted, type Ref, type ComputedRef } from 'vue'

interface BaseUseApiOptions<T> {
  immediate?: boolean
  initialData?: T
  fetchOptions?: RequestInit
}

export interface PaginatedOptions<T> extends BaseUseApiOptions<T> {
  pagination: true
  perPage?: number
  initialPage?: number
}

export interface NonPaginatedOptions<T> extends BaseUseApiOptions<T> {
  pagination?: false
  perPage?: never
  initialPage?: never
}

export type UseApiOptions<T> = PaginatedOptions<T> | NonPaginatedOptions<T>

export interface BaseApiResponse<T> {
  data: Ref<T>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  execute: () => Promise<T | null>
}

export interface PaginationControls<T> {
  page: Ref<number>
  perPage: Ref<number>
  total: Ref<number>
  totalPages: ComputedRef<number>
  hasNext: ComputedRef<boolean>
  hasPrev: ComputedRef<boolean>
  nextPage: () => Promise<T | null>
  prevPage: () => Promise<T | null>
  setPage: (newPage: number) => Promise<T | null>
}

export type PaginatedApiResponse<T> = BaseApiResponse<T> & PaginationControls<T>

export const useApi = <T>(
  url: string,
  options: UseApiOptions<T> = {}
): PaginatedApiResponse<T> => {
  const {
    immediate = true,
    initialData = null as unknown as T,
    fetchOptions,
    pagination = false,
    perPage: initialPerPage = 10,
    initialPage = 1
  } = options

  const data = ref<T>(initialData) as Ref<T>
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Pagination refs
  const page = ref<number>(initialPage)
  const perPage = ref<number>(initialPerPage)
  const total = ref<number>(0)

  const totalPages = computed(() => {
    if (total.value === 0) return 1
    return Math.ceil(total.value / perPage.value)
  })

  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)

  const buildUrl = (): string => {
    if (!pagination) return url
    const skip = (page.value - 1) * perPage.value
    const delimiter = url.includes('?') ? '&' : '?'
    return `${url}${delimiter}limit=${perPage.value}&skip=${skip}`
  }

  const execute = async (): Promise<T | null> => {
    isLoading.value = true
    error.value = null

    try {
      const endpoint = buildUrl()
      const response = await fetch(endpoint, fetchOptions)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: T = await response.json()
      data.value = result

      if (
        result &&
        typeof result === 'object' &&
        'total' in result &&
        typeof (result as Record<string, unknown>).total === 'number'
      ) {
        total.value = (result as Record<string, unknown>).total as number
      }

      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown network error'
      error.value = message
      return null
    } finally {
      isLoading.value = false
    }
  }

  const setPage = async (newPage: number): Promise<T | null> => {
    if (newPage < 1 || (total.value > 0 && newPage > totalPages.value)) return null
    page.value = newPage
    return execute()
  }

  const nextPage = async (): Promise<T | null> => {
    return hasNext.value ? setPage(page.value + 1) : null
  }

  const prevPage = async (): Promise<T | null> => {
    return hasPrev.value ? setPage(page.value - 1) : null
  }

  if (immediate) {
    onMounted(() => {
      execute()
    })
  }

  return {
    data,
    isLoading,
    error,
    execute,
    page,
    perPage,
    total,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    setPage
  }
}