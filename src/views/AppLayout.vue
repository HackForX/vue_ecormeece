<template>
  <div>
    <!-- Header -->
    <header v-if="showMenu" class="bg-indigo-800 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-semibold">E-Commerce App</h1>

        <!-- Hamburger Menu for Mobile -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden text-white focus:outline-none"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex">
          <ul class="flex space-x-6 items-center">
            <li>
              <router-link to="/" class="text-white hover:text-gray-200"
                >Home</router-link
              >
            </li>

            <li v-if="isAuthenticated && isAdmin">
              <router-link to="/admin" class="text-white hover:text-gray-200"
                >Admin</router-link
              >
            </li>
            <li class="relative" v-if="isAuthenticated && !isAdmin">
              <button
                @click="toggleCartOverlay"
                class="relative flex items-center"
              >
                <span id="cart-icon" class="material-icons text-white text-2xl">
                  shopping_cart
                </span>
                <span
                  v-if="cartCount > 0"
                  class="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                >
                  {{ cartCount }}
                </span>
              </button>
            </li>
            <li v-if="!isAuthenticated">
              <router-link to="/login" class="text-white hover:text-gray-200"
                >Login</router-link
              >
            </li>
            <li v-if="isAuthenticated">
              <button @click="Logout" class="text-white hover:text-gray-200">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMobileMenuOpen" class="lg:hidden mt-4">
        <ul class="flex flex-col space-y-4">
          <li>
            <router-link to="/" class="text-white hover:text-gray-200"
              >Home</router-link
            >
          </li>

          <li v-if="isAuthenticated && isAdmin">
            <router-link to="/admin" class="text-white hover:text-gray-200"
              >Admin</router-link
            >
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login" class="text-white hover:text-gray-200"
              >Login</router-link
            >
          </li>
          <li v-if="isAuthenticated">
            <button @click="logout" class="text-white hover:text-gray-200">
              Logout
            </button>
          </li>
          <li class="relative" v-if="isAuthenticated && !isAdmin">
            <button
              @click="toggleCartOverlay"
              class="relative flex items-center"
            >
              <span id="cart-icon" class="material-icons text-white text-2xl">
                shopping_cart
              </span>
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full"
              >
                {{ cartCount }}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </header>

    <!-- Floating Cart Overlay -->
    <div
      v-if="isCartOverlayVisible"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50"
      @click="toggleCartOverlay"
    >
      <div
        class="w-96 bg-white shadow-xl rounded-md p-5 h-full overflow-y-auto relative"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="toggleCartOverlay"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 class="text-lg font-semibold mb-4 border-b pb-3">Shopping Cart</h2>

        <div v-if="cart.length === 0" class="text-center text-gray-500 py-10">
          <p>Your cart is empty.</p>
        </div>

        <div v-else>
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex items-center justify-between mb-4 border-b pb-3"
          >
            <div class="flex items-center">
              <img
                :src="getImageUrl(item.photo_path)"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-md border"
              />
              <div class="ml-4">
                <h3 class="text-sm font-semibold">{{ item.name }}</h3>
                <p class="text-xs text-gray-500">{{ item.description }}</p>
                <p class="text-sm font-bold text-black-600">
                  MMK{{ item.price }}
                </p>
                <div class="flex items-center mt-2">
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="bg-gray-200 px-2 py-1 rounded-md text-sm"
                  >
                    -
                  </button>
                  <span class="mx-2">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item.id)"
                    class="bg-gray-200 px-2 py-1 rounded-md text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="removeFromCart(item.id)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <!-- Cart Total & Checkout Button -->
          <div class="mt-6">
            <div class="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span class="text-black-600">MMK{{ cartTotal }}</span>
            </div>

            <router-link
              to="/checkout"
              class="block text-center bg-indigo-800 text-white py-2 px-4 rounded-md mt-4 hover:bg-indigo-800-700 transition"
            >
              Proceed to Checkout
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto py-8">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      isCartOverlayVisible: false,
      isMobileMenuOpen: false,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "cart", "cartCount", "cartTotal"]),
    isAdmin() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user && user.role === "admin"; // Check if the user role is admin
    },
    showMenu() {
      return !["/login", "/register"].includes(this.$route.path);
    },
  },
  methods: {
    ...mapActions(["removeFromCart", "increaseQuantity", "decreaseQuantity"]),
    async Logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    toggleCartOverlay() {
      this.isCartOverlayVisible = !this.isCartOverlayVisible;
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    getImageUrl(photoPath) {
      return `${import.meta.env.VITE_SERVER}/${photoPath}`;
    },
  },
};
</script>

<style scoped>
/* Custom styles for better modal and product card layout */
</style>
