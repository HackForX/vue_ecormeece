<!-- views/RegisterView.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Register />
  </div>
</template>

<script>
import Register from '../components/Register.vue';


export default {
  name: "RegisterView",
  components: {
    Register,
  },
};
</script>
