<template>
  <div
    class="bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-xl p-8 max-w-4xl mx-auto"
  >
    <h2 class="text-2xl font-bold text-gray-800 mb-8">Order Summary</h2>

    <!-- Cart is empty message -->
    <div v-if="cart.length === 0" class="text-center text-gray-500 py-12">
      <p class="text-xl">Your cart is empty.</p>
    </div>

    <!-- Cart Items -->
    <div v-else>
      <div class="space-y-6 mb-8">
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex justify-between items-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          <div class="flex items-center">
            <img
              :src="getImageUrl(item.photo_path)"
              :alt="item.name"
              class="w-24 h-24 object-cover rounded-lg mr-6 shadow-lg"
            />
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
            </div>
          </div>
          <div class="flex items-center text-gray-700 space-x-4">
            <span class="text-sm bg-gray-100 px-3 py-1 rounded-full"
              >x{{ item.quantity }}</span
            >
            <span class="font-semibold text-2xl text-black-600"
              >MMK{{ item.price * item.quantity }}</span
            >
          </div>
        </div>
      </div>

      <!-- Total Price Section -->
      <div
        class="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-black-50 to-black-50 rounded-lg"
      >
        <p class="text-2xl font-bold text-gray-800">Total:</p>
        <p class="text-2xl font-bold text-black-700">MMK{{ total }}</p>
      </div>

      <!-- User Info Form -->
      <div class="bg-white p-8 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Your Details</h2>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <!-- Name -->
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Full Name</label
              >
              <input
                type="text"
                v-model="user.name"
                id="name"
                class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <!-- Address -->
            <div>
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Shipping Address</label
              >
              <textarea
                v-model="user.address"
                id="address"
                rows="4"
                class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all"
                required
              ></textarea>
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
                >Email Address</label
              >
              <input
                type="email"
                v-model="user.email"
                id="email"
                class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-8">
              <button
                type="submit"
                class="w-full bg-indigo-700 text-white py-4 rounded-lg font-semibold hover:from-black-700 hover:to-black-700 transition-all duration-300"
                :disabled="isProcessing"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
  props: {
    cart: Array,
    total: Number,
  },
  data() {
    return {
      user: {
        name: "",
        address: "",
        email: "",
      },
      isProcessing: false,
    };
  },
  getters: {
    userId: (state) => state.user.id,
  },
  methods: {
    getImageUrl(photoPath) {
      return `${import.meta.env.VITE_SERVER}/${photoPath}`;
    },
    async placeOrder() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/user/orders`,
       
          {
            user_id: user.id,
            customer_name: this.user.name,
            customer_email: this.user.email,
            shipping_address: this.user.address,
            items: this.cart.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request
            },
          }
        );

        return { success: true, message: "Order placed successfully" };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Failed to place order.",
        };
      }
    },
    async handleSubmit() {
      const toast = useToast();
      this.isProcessing = true;

      const result = await this.placeOrder();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      this.isProcessing = false;
    },
  },
};
</script>
