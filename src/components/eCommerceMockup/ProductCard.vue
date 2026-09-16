<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from './hooks/useCart'
import styles from './ProductCard.module.css'


export interface Product {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
}

const props = defineProps<{
  product: Product
}>()

const { addToCart, cart } = useCart()
const existsInCart = computed(() =>
  cart.value.some((item) => item.id === props.product.id)
)
</script>

<template>
  <article :class="styles.card">
    <div :class="styles.media">
      <img :src="product.thumbnail" :alt="product.title" loading="lazy" />
    </div>

    <div :class="styles.body">
      <span :class="styles.badge">{{ product.category }}</span>
      <h3 :class="styles.title">{{ product.title }}</h3>
      <p :class="styles.desc">{{ product.description }}</p>

      <div :class="styles.footer">
        <span :class="styles.price">£{{ product.price.toFixed(2) }}</span>
        <button 
          type="button" 
          :class="styles.action"
          @click="addToCart(product)"
        >
          {{ existsInCart ? 'Add Another' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </article>
</template>