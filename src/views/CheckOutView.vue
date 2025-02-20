<template>
  <div>
    <Checkout :cart="cart" :total="cartTotal" @checkout="checkout" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Checkout from '../components/Checkout.vue';

export default {
  name: 'CheckoutView',
  components: { Checkout },
  computed: {
    ...mapGetters(['cart', 'cartTotal']),
  },
  methods: {
    ...mapActions(['clearCart', 'addOrder']),
    
    async checkout() {
      // Check if cart has items
      if (this.cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Prepare order data
      const order = {
        products: this.cart,
        totalPrice: this.cartTotal,
        // You can add more details if required (e.g., payment method, shipping address)
      };

      try {
        // Add order via Vuex action
        await this.addOrder(order);
        
        // Clear cart after successful order placement
        this.clearCart();
        
        // Optionally, show a confirmation or navigate to a different page
        this.$router.push('/');
        alert("🎉 Order placed successfully!");
      } catch (error) {
        // Handle any errors
        console.error("Error placing order:", error);
        alert("There was an error while placing your order. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* You can add any custom styles here for checkout view */
</style>
