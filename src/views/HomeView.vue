<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center text-black-600 mb-8">Products</h1>
    <ProductList />
  </div>
</template>

<script>
import ProductList from "@/components/ProductList.vue";

export default {
  name: "HomeView",
  components: {
    ProductList,
  },
};
</script>
