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
