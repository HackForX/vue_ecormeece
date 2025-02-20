<template>
  <div>
    <div v-for="product in cart" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>MMK{{ product.price }}</p>
      <button @click="removeFromCart(product.id)">Remove</button>
    </div>
    <p>Total: MMK{{ total }}</p>
    <router-link to="/checkout">Proceed to Checkout</router-link>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Cart',
  props: {
    cart: Array,
    total: Number,
  },
  methods: {
    ...mapActions(['removeFromCart']),
  },
};
</script>