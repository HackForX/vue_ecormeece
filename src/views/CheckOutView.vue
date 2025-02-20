<template>
  <div>
    <Checkout :cart="cart" :total="cartTotal" @checkout="checkout" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Checkout from "../components/Checkout.vue";
export default {
  name: "CheckoutView",
  components: { Checkout },
  computed: {
    ...mapGetters(["cart", "cartTotal"]),
  },
  methods: {
    ...mapActions(["clearCart", "addOrder"]),
  },
};
</script>

<style scoped>
/* You can add any custom styles here for checkout view */
</style>
