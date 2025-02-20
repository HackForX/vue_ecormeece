<!-- components/RegisterForm.vue -->
<template>
  <div class="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
    <h2 class="text-3xl font-bold text-center text-black-600 mb-6">
      Create an Account
    </h2>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Name Input -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          v-model="name"
          required
          class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>

      <!-- Email Input -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          v-model="email"
          required
          class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>

      <!-- Password Input -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
        <input
          type="password"
          v-model="password"
          required
          class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>

      <!-- Password Confirmation Input -->
      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
        <input
          type="password"
          v-model="password_confirmation"
          required
          class="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
        />
      </div>

      <!-- Register Button -->
      <button
        type="submit"
        class="w-full bg-indigo-800 text-white py-3 rounded-md hover:bg-indigo-800-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-black-500"
        :disabled="loading"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>

      <!-- Error Message -->
      <p v-if="error" class="text-red-500 text-sm text-center mt-2">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RegisterForm",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    ...mapActions(["register"]), // Using Vuex actions

    async handleRegister() {
      this.loading = true;
      this.error = null;

      // Validate if password and confirmation match
      if (this.password !== this.password_confirmation) {
        this.error = "Passwords do not match!";
        this.loading = false;
        return;
      }

      try {
        await this.register({
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        });
        this.$router.push("/login"); // Redirect to login page after registration
      } catch (err) {
        this.error = err.response?.data?.message || "Registration failed!";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
