<template>
  <div>
    <Login @login="login" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Login from '../components/Login.vue';

export default {
  name: 'LoginView',
  components: { Login },
  methods: {
    ...mapActions(['login']),
  },
};
</script>