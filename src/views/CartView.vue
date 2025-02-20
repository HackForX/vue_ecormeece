<template>
  <div>
    <h1>Cart</h1>
    <Cart :cart="cart" :total="cartTotal" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Cart from '../components/Cart.vue';

export default {
  name: 'CartView',
  components: { Cart },
  computed: {
    ...mapGetters(['cart', 'cartTotal']),
  },
};
</script>