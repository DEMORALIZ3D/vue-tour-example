<script setup lang="ts">
import styles from './cart.module.css'
import { useCart } from './hooks/useCart';

const { cart, totalCount, totalPrice, removeFromCart, clearCart } = useCart();
</script>

<template>
  <!-- Trigger Button -->
  <button
    type="button"
    popovertarget="cart-popover"
    :class="styles['cart-trigger']"
  >
    <span>Cart</span>
    <span v-if="totalCount > 0" :class="styles['cart-badge']">
      {{ totalCount }}
    </span>
  </button>

  <!-- Native Popover Element -->
  <div id="cart-popover" popover :class="styles['cart-popover']">
    <div :class="styles['cart-header']">
      <h4>Your Order</h4>
      <button
        v-if="cart.length"
        type="button"
        :class="styles['clear-btn']"
        @click="clearCart"
      >
        Clear
      </button>
    </div>

    <div v-if="!cart.length" :class="styles['empty-state']">
      Your cart is empty.
    </div>

    <ul v-else :class="styles['cart-list']">
      <li
        v-for="item in cart"
        :key="item.id"
        :class="styles['cart-row']"
      >
        <div :class="styles['item-info']">
          <span :class="styles['item-title']">{{ item.title }}</span>
          <span :class="styles['item-meta']">
            {{ item.quantity }} &times; £{{ item.price.toFixed(2) }}
          </span>
        </div>
        <button
          type="button"
          :class="styles['remove-btn']"
          @click="removeFromCart(item.id)"
        >
          &times;
        </button>
      </li>
    </ul>

    <div v-if="cart.length" :class="styles['cart-footer']">
      <div :class="styles['total-row']">
        <span>Total</span>
        <strong>£{{ totalPrice.toFixed(2) }}</strong>
      </div>
      <button type="button" :class="styles['checkout-btn']">
        Checkout (£{{ totalPrice.toFixed(2) }})
      </button>
    </div>
  </div>
</template>