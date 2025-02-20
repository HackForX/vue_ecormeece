<template>
  <form @submit.prevent="handleRegister">
    <div>
      <label for="name">Name:</label>
      <input type="text" v-model="name" required />
    </div>
    <div>
      <label for="email">Email:</label>
      <input type="email" v-model="email" required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" v-model="password" required />
    </div>
    <button type="submit">Register</button>
  </form>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    handleRegister() {
      this.$emit('register', { name: this.name, email: this.email, password: this.password });
    },
  },
};
</script>