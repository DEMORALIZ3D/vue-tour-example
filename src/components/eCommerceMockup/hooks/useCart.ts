import { ref, computed } from 'vue';

export interface CartProduct {
  id: string | number;
  title: string;
  price: number;
  thumbnail?: string;
  image?: string;
  category?: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

// Module-level reactive singleton
const cart = ref<CartItem[]>([]);

export const useCart = () => {
  const totalCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const addToCart = (product: CartProduct) => {
    const existing = cart.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  const updateQuantity = (id: string | number, delta: number) => {
    const item = cart.value.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = newQty;
    }
  };

  const removeFromCart = (id: string | number) => {
    const idx = cart.value.findIndex((item) => item.id === id);
    if (idx > -1) cart.value.splice(idx, 1);
  };

  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    totalCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};