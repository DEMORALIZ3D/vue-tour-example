<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Search, Filter, X, RotateCcw } from 'lucide-vue-next';
import styles from './styles.module.css';
import { useGetProductCategories } from '../../api/useGetProductCategories';
import { useGetProducts } from '../../api/useGetProducts';
import Grid from '../Grid';
import ProductCard from './ProductCard.vue';

const search = ref('');
const debouncedSearch = ref('');
const selectedCategory = ref<string | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(search, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = newVal;
  }, 300);
});

const clearSearch = () => {
  search.value = '';
  debouncedSearch.value = '';
};

const selectCategory = (categorySlug: string | null) => {
  selectedCategory.value = selectedCategory.value === categorySlug ? null : categorySlug;
};

const resetAllFilters = () => {
  clearSearch();
  selectedCategory.value = null;
};

const { categories, isLoading: categoriesLoading } = useGetProductCategories();

const {
  products,
  productsIsLoading,
  productsHasError,
  productsTotalPages,
  productsTotal,
  productsCurrentPage,
  productsHasNext,
  productsHasPrev,
  productsNextPage,
  productsPrevPage
} = useGetProducts({
  searchQuery: debouncedSearch,
  category: selectedCategory,
  perPage: 9
});

const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return null;
  const match = categories.value.find((c) => c.slug === selectedCategory.value);
  return match ? match.name : selectedCategory.value;
});

const hasActiveFilters = computed(() => Boolean(debouncedSearch.value || selectedCategory.value));
</script>

<template>
  <div :class="styles.products">
    <!-- Filter and Search Bar -->
    <div :class="styles['filter-bar']">
      <div :class="styles['search-root']" data-tour="search-bar">
        <Search :size="18" :class="styles['search-icon']" />
        <input
          id="search-input"
          v-model="search"
          :class="styles['search-input']"
          type="text"
          placeholder="Search products by name, brand, or tag..."
        />
        <button
          v-if="search"
          type="button"
          :class="styles['clear-search-btn']"
          title="Clear search"
          @click="clearSearch"
        >
          <X :size="14" />
        </button>
      </div>

      <div :class="styles['filter-options']">
        <button
          id="filter-pop-cta"
          :class="[styles['filter-pop-cta'], selectedCategory ? styles['has-filter'] : '']"
          popovertarget="filter-pop"
          data-tour="category-filter"
        >
          <Filter :size="16" />
          <span>Category</span>
          <span v-if="selectedCategory" :class="styles['filter-badge']">1</span>
        </button>

        <!-- Category Popover -->
        <div id="filter-pop" :class="styles['filter-pop']" popover data-tour="category-popover">
          <div :class="styles['filter-pop-header']">
            <h4>Filter by Category</h4>
            <button
              v-if="selectedCategory"
              type="button"
              :class="styles['clear-search-btn']"
              title="Clear category"
              @click="selectCategory(null)"
            >
              <X :size="14" />
            </button>
          </div>

          <div :class="styles['filter-pop-body']">
            <div v-if="categoriesLoading" :class="styles['loading-container']">
              <div :class="styles.spinner" />
              <span>Loading categories...</span>
            </div>

            <div v-else :class="styles['category-chips']" data-tour="category-chips">
              <button
                type="button"
                :class="[styles['category-chip'], !selectedCategory ? styles.active : '']"
                @click="selectCategory(null)"
              >
                All Products
              </button>
              <button
                v-for="cat in categories"
                :key="cat.slug"
                type="button"
                :class="[styles['category-chip'], selectedCategory === cat.slug ? styles.active : '']"
                @click="selectCategory(cat.slug)"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Filters & Result Count Summary -->
    <div :class="styles['active-filters-row']" data-tour="active-filters">
      <div :class="styles['active-pills']">
        <span v-if="debouncedSearch" :class="styles['active-pill']">
          Search: "{{ debouncedSearch }}"
          <button type="button" @click="clearSearch"><X :size="12" /></button>
        </span>
        <span v-if="selectedCategoryName" :class="styles['active-pill']">
          Category: {{ selectedCategoryName }}
          <button type="button" @click="selectCategory(null)"><X :size="12" /></button>
        </span>
        <button
          v-if="hasActiveFilters"
          type="button"
          :class="styles['nav-link']"
          style="padding: 2px 8px; font-size: 0.78rem;"
          @click="resetAllFilters"
        >
          Reset all
        </button>
      </div>

      <div :class="styles['result-count']">
        <span v-if="!productsIsLoading">
          Showing <strong>{{ products.length }}</strong> of <strong>{{ productsTotal }}</strong> items
        </span>
        <span v-else>Loading items...</span>
      </div>
    </div>

    <!-- Main Products Grid -->
    <div id="product-grid" :class="styles['product-area']" data-tour="product-grid">
      <Grid
        :items="products"
        :is-loading="productsIsLoading"
        :error="productsHasError"
        :page="productsCurrentPage"
        :total-pages="productsTotalPages"
        :has-next="productsHasNext"
        :has-prev="productsHasPrev"
        :columns="3"
        :row-height="380"
        @next="productsNextPage"
        @prev="productsPrevPage"
      >
        <template #item="{ item }">
          <ProductCard :product="item" />
        </template>

        <template #empty>
          <div :class="styles['loading-container']" style="padding: 60px 20px;">
            <p style="font-size: 1.05rem; font-weight: 600; color: #1e293b;">No products match your criteria</p>
            <p style="font-size: 0.85rem; color: #64748b;">Try adjusting your search query or removing category filters.</p>
            <button
              v-if="hasActiveFilters"
              type="button"
              :class="styles['filter-pop-cta']"
              style="margin-top: 8px;"
              @click="resetAllFilters"
            >
              <RotateCcw :size="14" />
              <span>Reset all filters</span>
            </button>
          </div>
        </template>
      </Grid>
    </div>
  </div>
</template>