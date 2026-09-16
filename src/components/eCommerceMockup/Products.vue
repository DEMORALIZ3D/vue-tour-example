<script setup lang="ts">
import { ref } from 'vue';
import styles from './styles.module.css';
import { Filter } from 'lucide-vue-next'
import { useGetProductCategories } from '../../api/useGetProductCategories';
import { useGetProducts } from '../../api/useGetProducts';
import Grid from '../Grid'
import ProductCard from './ProductCard.vue';

const search = ref('');
const { categories, isLoading, hasError } = useGetProductCategories();
const { products, productsIsLoading, productsHasError, productsTotalPages, productsTotal, productsPerPage, productsCurrentPage, productsHasNext, productsHasPrev, productsNextPage, productsPrevPage } = useGetProducts();

</script>

<template>
    <div :class="styles.products">
        <div :class="styles['filter-bar']">
            <div :class="styles['search-root']">
                <input v-model="search" id="search" :class="styles['search-input']" type="text"
                    placeholder="Search Products" />
            </div>
            <div :class="styles['filter-options']">
                <button id="filter-pop-cta" :class="styles['filter-pop-cta']" popovertarget="filter-pop">
                    <Filter :size="14" />
                </button>

                <div id="filter-pop" :class="styles['filter-pop']" popover>
                    <div>
                        <div v-if="isLoading">
                            Loading...
                        </div>
                        <div v-if="hasError">Error occurred</div>
                        <div v-if="categories">
                            <div v-for="(category) in categories">
                                <span>{{ category.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="productsIsLoading">
            Loading...
        </div>
        <div v-if="productsHasError">Error occurred</div>
        <div v-if="products" :class="styles['product-area']">
            <Grid :items="products" :is-loading="productsIsLoading" :error="productsHasError"
                :page="productsCurrentPage" :total-pages="productsTotalPages" :has-next="productsHasNext"
                :has-prev="productsHasPrev" :columns="3" :row-height="360" @next="productsNextPage"
                @prev="productsPrevPage">
                <!-- The Grid executes the slot and injects { item, index } -->
                <template #item="{ item }">
                    <ProductCard :product="item" />
                </template>

                <!-- Optional custom empty state -->
                <template #empty>
                    <p>No products match your criteria.</p>
                </template>
            </Grid>
        </div>
    </div>
</template>