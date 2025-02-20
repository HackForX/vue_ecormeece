<template>
  <div>
    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div v-for="i in 8" :key="i" class="bg-white shadow-md rounded-lg p-4">
        <div class="animate-pulse">
          <div class="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
          <div class="bg-gray-300 h-6 w-3/4 mb-2"></div>
          <div class="bg-gray-300 h-4 w-full mb-2"></div>
          <div class="bg-gray-300 h-4 w-1/2 mb-4"></div>
          <div class="bg-gray-300 h-10 w-full rounded-md"></div>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      Error: {{ error }}
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-200 transform hover:-translate-y-3 cursor-pointer"
      >
        <img
          :src="getImageUrl(product.photo_path)"
          :alt="product.name"
          class="w-full h-48 object-cover rounded-md mb-4"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        />
        <h2 class="text-xl font-semibold">{{ product.name }}</h2>

        <p class="text-gray-600 text-sm">{{ product.description }}</p>
        <p class="text-lg font-bold text-black-600 mt-2">
          MMK{{ product.price }}
        </p>
        <button
          @click="addToCart(product)"
          class="mt-4 w-full bg-indigo-800 text-white py-2 px-4 rounded-md hover:bg-indigo-800-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ProductList",
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  computed: {
    ...mapState(["products"]),
  },
  methods: {
    ...mapActions(["fetchProducts", "addToCart"]),
    getImageUrl(photoPath) {
      return `${import.meta.env.VITE_SERVER}/${photoPath}`;
    },
  },
  async created() {
    try {
      await this.fetchProducts();
    } catch (err) {
      this.error = "Failed to load products.";
    } finally {
      this.loading = false;
    }
  },
};
</script>
