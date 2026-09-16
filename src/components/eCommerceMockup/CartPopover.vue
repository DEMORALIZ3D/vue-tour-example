<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle } from 'lucide-vue-next'
import styles from './cart.module.css'
import { useCart } from './hooks/useCart'

const { cart, totalCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()

const isCheckingOut = ref(false)
const orderSuccess = ref(false)

const handleCheckout = () => {
  if (!cart.value.length) return
  isCheckingOut.value = true
  setTimeout(() => {
    isCheckingOut.value = false
    orderSuccess.value = true
    clearCart()
    setTimeout(() => {
      orderSuccess.value = false
    }, 3000)
  }, 1000)
}
</script>

<template>
  <!-- Trigger Button -->
  <button
    id="cart-trigger"
    type="button"
    popovertarget="cart-popover"
    :class="styles['cart-trigger']"
    data-tour="cart-button"
  >
    <ShoppingBag :size="16" />
    <span>Cart</span>
    <span v-if="totalCount > 0" :class="styles['cart-badge']">
      {{ totalCount }}
    </span>
  </button>

  <!-- Native Popover Element -->
  <div id="cart-popover" popover :class="styles['cart-popover']" data-tour="cart-popover">
    <div :class="styles['cart-header']">
      <div :class="styles['header-title']">
        <ShoppingBag :size="16" />
        <h4>Your Order</h4>
      </div>
      <button
        v-if="cart.length"
        type="button"
        :class="styles['clear-btn']"
        data-tour="cart-clear"
        @click="clearCart"
      >
        Clear all
      </button>
    </div>

    <!-- Order Success Feedback -->
    <div v-if="orderSuccess" :class="styles['success-banner']">
      <CheckCircle :size="24" color="#10b981" />
      <div>
        <strong>Order Placed!</strong>
        <p>Thank you for testing the demo.</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!cart.length" :class="styles['empty-state']">
      <div :class="styles['empty-icon-wrapper']">
        <ShoppingBag :size="28" color="#94a3b8" />
      </div>
      <p :class="styles['empty-title']">Your cart is empty</p>
      <span :class="styles['empty-subtitle']">Add items to preview your order</span>
    </div>

    <!-- Cart List -->
    <ul v-else :class="styles['cart-list']">
      <li
        v-for="item in cart"
        :key="item.id"
        :class="styles['cart-row']"
      >
        <div :class="styles['item-preview']">
          <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" :class="styles['thumb']" />
          <div :class="styles['item-info']">
            <span :class="styles['item-title']" :title="item.title">{{ item.title }}</span>
            <span :class="styles['item-price']">£{{ item.price.toFixed(2) }} each</span>
          </div>
        </div>

        <div :class="styles['item-controls']">
          <div :class="styles['qty-picker']">
            <button
              type="button"
              :class="styles['qty-btn']"
              aria-label="Decrease quantity"
              @click="updateQuantity(item.id, -1)"
            >
              <Minus :size="12" />
            </button>
            <span :class="styles['qty-value']">{{ item.quantity }}</span>
            <button
              type="button"
              :class="styles['qty-btn']"
              aria-label="Increase quantity"
              @click="updateQuantity(item.id, 1)"
            >
              <Plus :size="12" />
            </button>
          </div>

          <button
            type="button"
            :class="styles['remove-btn']"
            title="Remove item"
            @click="removeFromCart(item.id)"
          >
            <Trash2 :size="14" />
          </button>
        </div>
      </li>
    </ul>

    <!-- Footer Summary & Checkout -->
    <div v-if="cart.length" :class="styles['cart-footer']">
      <div :class="styles['total-row']">
        <span>Subtotal ({{ totalCount }} items)</span>
        <strong>£{{ totalPrice.toFixed(2) }}</strong>
      </div>
      <button 
        type="button" 
        :class="styles['checkout-btn']"
        :disabled="isCheckingOut"
        data-tour="cart-checkout"
        @click="handleCheckout"
      >
        {{ isCheckingOut ? 'Processing...' : `Checkout • £${totalPrice.toFixed(2)}` }}
      </button>
    </div>
  </div>
</template>