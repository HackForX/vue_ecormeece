<template>
  <div>
    <h1>Register</h1>
    <Register @register="register" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Register from '../components/Register.vue';

export default {
  name: 'RegisterView',
  components: { Register },
  methods: {
    ...mapActions(['register']),
  },
};
</script>