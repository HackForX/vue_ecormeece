<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-black-600 mb-6">
        Welcome Back
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email:</label
          >
          <input
            type="email"
            v-model="email"
            required
            class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password:</label
          >
          <input
            type="password"
            v-model="password"
            required
            class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
          />
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full bg-indigo-800 text-white py-3 rounded-md hover:bg-indigo-800-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-black-500"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <!-- Error Message -->
        <p v-if="error" class="text-red-500 text-sm text-center mt-2">
          {{ error }}
        </p>

        <!-- Register Link -->
        <p class="text-sm text-center text-gray-600 mt-4">
          Don't have an account?
          <router-link to="/register" class="text-black-500 hover:underline"
            >Sign up</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    ...mapActions(["login", "getUser"]), // Using Vuex actions

    async handleLogin() {
      this.loading = true;
      this.error = null;
      try {
        await this.login({ email: this.email, password: this.password });
        await this.getUser(); // Fetch user data after login

        this.$router.push("/"); // Redirect to home or dashboard
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed!";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
