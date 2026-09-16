<script setup lang="ts">
import { computed } from 'vue'
import { Star, ShoppingBag, Check } from 'lucide-vue-next'
import { useCart } from './hooks/useCart'
import type { Product } from '../../api/useGetProducts'
import styles from './ProductCard.module.css'

const props = defineProps<{
  product: Product
}>()

const { addToCart, cart } = useCart()
const cartItem = computed(() =>
  cart.value.find((item) => item.id === props.product.id)
)
</script>

<template>
  <article :class="styles.card" data-tour="product-card" :data-product-id="product.id">
    <div :class="styles.media">
      <img :src="product.thumbnail" :alt="product.title" loading="lazy" />
      <span v-if="product.discountPercentage && product.discountPercentage > 10" :class="styles['discount-tag']">
        -{{ Math.round(product.discountPercentage) }}%
      </span>
    </div>

    <div :class="styles.body">
      <div :class="styles['meta-row']">
        <span :class="styles.badge">{{ product.category }}</span>
        <div v-if="product.rating" :class="styles.rating">
          <Star :size="12" fill="#f59e0b" color="#f59e0b" />
          <span>{{ product.rating.toFixed(1) }}</span>
        </div>
      </div>

      <h3 :class="styles.title" :title="product.title">{{ product.title }}</h3>
      <p :class="styles.desc">{{ product.description }}</p>

      <div :class="styles.footer">
        <div :class="styles['price-block']">
          <span :class="styles.price">£{{ product.price.toFixed(2) }}</span>
        </div>
        <button 
          type="button" 
          :class="[styles.action, cartItem ? styles['in-cart'] : '']"
          data-tour="add-to-cart"
          @click="addToCart(product)"
        >
          <component :is="cartItem ? Check : ShoppingBag" :size="14" />
          <span>{{ cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart' }}</span>
        </button>
      </div>
    </div>
  </article>
</template>