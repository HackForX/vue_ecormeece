<template>
  <div>
    <h2>Products</h2>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>MMK{{ product.price }}</p>
      <button @click="editProduct(product)">Edit</button>
      <button @click="deleteProduct(product.id)">Delete</button>
    </div>
    <button @click="addProduct">Add Product</button>

    <h2>Orders</h2>
    <div v-for="order in orders" :key="order.id">
      <p>Products: {{ order.products }}</p>
      <p>Total Price: MMK{{ order.totalPrice }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  props: {
    products: Array,
    orders: Array,
  },
  methods: {
    addProduct() {
      const name = prompt('Enter product name');
      const description = prompt('Enter product description');
      const price = parseFloat(prompt('Enter product price'));
      if (name && description && price) {
        this.$emit('addProduct', { name, description, price });
      }
    },
    editProduct(product) {
      const name = prompt('Enter new product name', product.name);
      const description = prompt('Enter new product description', product.description);
      const price = parseFloat(prompt('Enter new product price', product.price));
      if (name && description && price) {
        this.$emit('editProduct', { ...product, name, description, price });
      }
    },
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.$emit('deleteProduct', productId);
      }
    },
  },
};
</script>