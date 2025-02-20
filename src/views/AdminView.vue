<template>
  <div class="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
    <h2 class="text-3xl font-semibold text-gray-800 mb-8">
      Product and Order Management
    </h2>

    <!-- Tabs Navigation -->
    <div class="flex border-b-2 border-gray-200 mb-6">
      <button
        :class="{
          'text-black-600 border-black-600': activeTab === 'products',
          'text-gray-500 hover:text-gray-700': activeTab !== 'products',
        }"
        @click="activeTab = 'products'"
        class="py-2 px-6 font-semibold focus:outline-none transition-all duration-300 border-b-2 border-transparent"
      >
        Products
      </button>
      <button
        :class="{
          'text-black-600 border-black-600': activeTab === 'orders',
          'text-gray-500 hover:text-gray-700': activeTab !== 'orders',
        }"
        @click="activeTab = 'orders'"
        class="py-2 px-6 font-semibold focus:outline-none transition-all duration-300 border-b-2 border-transparent"
      >
        Orders
      </button>
    </div>

    <!-- Products Tab Content -->
    <div v-if="activeTab === 'products'">
      <!-- Add Product Button -->
      <div class="mb-6 flex justify-end">
        <button
          @click="openAddProductModal"
          class="bg-indigo-800 text-white py-2 px-6 rounded-lg hover:bg-indigo-800-700 transition-all duration-300 flex items-center"
        >
          <span class="material-icons mr-2">add</span>
          Add New Product
        </button>
      </div>

      <!-- Product List -->
      <div v-if="products.length > 0" class="space-y-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="flex justify-between items-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
        >
          <div class="flex items-center space-x-6">
            <img
              :src="getImageUrl(product.photo_path)"
              alt="Product Image"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ product.description }}
              </p>
              <p class="text-sm text-black-600 font-semibold mt-2">
                MMK{{ product.price }}
              </p>
            </div>
          </div>
          <div class="flex space-x-4">
            <button
              @click="editProduct(product)"
              class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 flex items-center"
            >
              <span class="material-icons mr-2">edit</span>
              Edit
            </button>
            <button
              @click="confirmDeleteProduct(product.id)"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center"
            >
              <span class="material-icons mr-2">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- No Products Message -->
      <div v-else class="text-center text-gray-500 py-10">
        <p class="text-lg">No products available.</p>
      </div>

      <!-- Add/Edit Product Modal -->
      <div
        v-if="showAddProductModal"
        class="fixed inset-0 flex items-center justify-center bg-indigo-800 bg-opacity-50 z-50"
      >
        <div class="bg-white p-8 rounded-lg w-1/3 shadow-xl">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6">
            {{ editMode ? "Edit Product" : "Add New Product" }}
          </h3>
          <form @submit.prevent="submitForm">
            <div class="space-y-4">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  >Product Name</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="productForm.name"
                  class="w-full p-3 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700"
                  >Product Description</label
                >
                <textarea
                  id="description"
                  v-model="productForm.description"
                  class="w-full p-3 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition-all duration-300"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  for="price"
                  class="block text-sm font-medium text-gray-700"
                  >Price</label
                >
                <input
                  type="number"
                  id="price"
                  v-model="productForm.price"
                  class="w-full p-3 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label
                  for="photo"
                  class="block text-sm font-medium text-gray-700"
                  >Product Image</label
                >
                <input
                  type="file"
                  id="photo"
                  @change="handleFileUpload"
                  class="w-full p-3 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-black-500 focus:border-black-500 transition-all duration-300"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-between">
              <button
                @click="cancelForm"
                type="button"
                class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-indigo-800 text-white px-6 py-2 rounded-lg hover:bg-indigo-800-700 transition-all duration-300"
              >
                {{ editMode ? "Update" : "Add" }} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Orders Tab Content -->

    <div v-if="activeTab === 'orders'">
      <div v-if="orders.length > 0" class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
        >
          <h3 class="text-xl font-semibold text-gray-900">
            Order #{{ order.id }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Customer: {{ order.customer_name }}
          </p>
          <p class="text-sm text-gray-600">Email: {{ order.customer_email }}</p>
          <p class="text-sm text-gray-600">
            Total Items: {{ order.items.length }}
          </p>
          <p class="text-sm text-black-600 font-semibold mt-2">
            Total Price: MMK{{ order.total }}
          </p>
          <button
            @click="confirmDeleteOrder(order.id)"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center mt-4"
          >
            <span class="material-icons mr-2">delete</span>
            Delete Order
          </button>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        <p class="text-lg">No orders available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      activeTab: "products", // Active tab starts with "products"
      showAddProductModal: false,
      editMode: false,
      productForm: {
        id: null,
        name: "",
        description: "",
        price: "",
        photo: null,
      },
    };
  },
  computed: {
    ...mapGetters(["products","orders"]),
  },
  methods: {
    ...mapActions([
      "fetchProducts",
      "addProduct",
      "updateProduct",
      "deleteProduct",
      "fetchOrders",
      "deleteOrder"
    ]),

    getImageUrl(photoPath) {
      return `${import.meta.env.VITE_SERVER}/${photoPath}`;
    },

    // Open modal to add a new product
    openAddProductModal() {
      this.editMode = false;
      this.productForm = {
        id: null,
        name: "",
        description: "",
        price: "",
        photo: null,
      };
      this.showAddProductModal = true;
    },

    // Open modal to edit a product
    editProduct(product) {
      this.editMode = true;
      this.productForm = { ...product, photo: null }; // Reset photo to allow re-upload
      this.showAddProductModal = true;
    },

    // Handle file upload
    handleFileUpload(event) {
      this.productForm.photo = event.target.files[0];
    },

    // Submit the form
    async submitForm() {
      const formData = new FormData();
      formData.append("name", this.productForm.name);
      formData.append("description", this.productForm.description);
      formData.append("price", this.productForm.price);
      if (this.productForm.photo) {
        formData.append("photo", this.productForm.photo);
      }

      if (this.editMode) {
        await this.updateProduct({ id: this.productForm.id, data: formData });
      } else {
        await this.addProduct(formData);
      }

      this.showAddProductModal = false;
      this.fetchProducts(); // Reload product list
    },

    // Cancel form and close modal
    cancelForm() {
      this.showAddProductModal = false;
    },

    // Confirm and delete product
    async confirmDeleteProduct(productId) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmDelete) {
        // Call the deleteProduct action from Vuex
        await this.deleteProduct({ id: productId });
        this.fetchProducts(); // Reload product list after deletion
      }
    },
     async confirmDeleteOrder(orderId) {
    const confirmDelete = confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      await this.deleteOrder({ id: orderId });
      this.fetchOrders(); // Reload order list after deletion
    }
  },
  },

  mounted() {
    this.fetchProducts();
     this.fetchOrders();
  },
};
</script>

<style scoped>
/* Custom styles for better modal and product card layout */
</style>
