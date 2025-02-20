import { createStore } from "vuex";
import axios from "axios";
import { useToast } from "vue-toastification";
export default createStore({
  state: {
    products: [],
    cart: [],
    orders: [],
    user: null,
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    ADD_TO_CART(state, product) {
      const existingProduct = state.cart.find((p) => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter((p) => p.id !== productId);
    },
    INCREASE_QUANTITY(state, productId) {
      const index = state.cart.findIndex((p) => p.id === productId);
      if (index !== -1) {
        // Create a new object reference for reactivity
        state.cart[index] = {
          ...state.cart[index],
          quantity: state.cart[index].quantity + 1,
        };
      }
    },
    DECREASE_QUANTITY(state, productId) {
      const index = state.cart.findIndex((p) => p.id === productId);
      if (index !== -1) {
        if (state.cart[index].quantity > 1) {
          // Create a new object reference for reactivity
          state.cart[index] = {
            ...state.cart[index],
            quantity: state.cart[index].quantity - 1,
          };
        } else {
          state.cart = state.cart.filter((p) => p.id !== productId); // Remove if quantity reaches 0
        }
      }
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
    SET_ORDERS(state, orders) {
      state.orders = orders;
    },
    ADD_ORDER(state, order) {
      state.orders.push(order);
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token); // Store token in localStorage
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set global auth header
    },
    LOGOUT(state) {
      state.user = null;
      state.token = "";
      localStorage.removeItem("token"); // Remove token from localStorage
      delete axios.defaults.headers.common["Authorization"]; // Remove auth header
    },
  },
  actions: {
    async fetchProducts({ commit, state }) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/products`,

          { headers: { Authorization: `Bearer ${state.token}` } }
        );
        commit("SET_PRODUCTS", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchOrders({ commit, state }) {
      try {
        const response = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        commit("SET_ORDERS", response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async addProduct({ commit, state }, productData) {
      const toast = useToast();
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/products`,
          productData,
          {
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );
        commit("ADD_PRODUCT", response.data);
        toast.success("Product added successfully!", { timeout: 2000 });
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product.", { timeout: 2000 });
      }
    },

    async updateProduct({ commit, state }, { id, data }) {
      const toast = useToast();
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/admin/products/${id}?_method=PUT`,
          data,
          {
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );
        commit("UPDATE_PRODUCT", response.data);
        toast.success("Product updated successfully!", { timeout: 2000 });
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product.", { timeout: 2000 });
      }
    },

    async deleteProduct({ commit, state }, { id }) {
      const toast = useToast();
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/admin/products/${id}`,
          {
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );
        commit("REMOVE_PRODUCT", id);
        toast.success("Product deleted successfully!", { timeout: 2000 });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product.", { timeout: 2000 });
      }
    },
    addToCart({ commit, state }, product) {
      const toast = useToast();
      const existingProduct = state.cart.find((p) => p.id === product.id);
      if (existingProduct) {
        toast.warning("Product already in cart!", {
          timeout: 2000,
        });
      } else {
        commit("ADD_TO_CART", product);
        toast.success("Added to cart!", {
          timeout: 2000,
        });
      }
    },
    removeFromCart({ commit }, productId) {
      commit("REMOVE_FROM_CART", productId);
    },
    increaseQuantity({ commit }, productId) {
      commit("INCREASE_QUANTITY", productId);
    },
    decreaseQuantity({ commit }, productId) {
      commit("DECREASE_QUANTITY", productId);
    },
    clearCart({ commit }) {
      commit("CLEAR_CART");
    },
    async addOrder({ commit, state }, order) {
      try {
        const response = await axios.post("/api/orders", order, {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        commit("ADD_ORDER", response.data);
      } catch (error) {
        console.error("Error adding order:", error);
      }
    },
    async register({ commit }, user) {
      try {
        const response = await axios.post("/api/auth/register", user);
        commit("SET_TOKEN", response.data.token);
        await this.dispatch("getUser"); // Fetch user details after registration
      } catch (error) {
        console.error("Error registering:", error);
        throw error;
      }
    },
    async login({ commit }, user) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/login`,
          user
        );
        commit("SET_TOKEN", response.data.access_token);
        await this.dispatch("getUser"); // Fetch user details after login
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    },
    async getUser({ commit, state }) {
      try {
        const response = await axios.get("/api/auth/user", {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        commit("SET_USER", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
  },
  getters: {
    products: (state) => state.products,
    cart: (state) => state.cart,
    orders: (state) => state.orders,
    cartCount: (state) => state.cart.length,
    cartTotal: (state) =>
      state.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ),
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user && state.user.isAdmin,
  },
});
