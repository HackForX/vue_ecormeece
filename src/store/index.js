import { createStore } from "vuex";
import axios from "axios";
import { useToast } from "vue-toastification";
export default createStore({
  state: {
    products: [],
    cart: [],
    orders: [],
    user: JSON.parse(localStorage.getItem("user")) || null,
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
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Remove token from localStorage
      delete axios.defaults.headers.common["Authorization"];
      // this.$router.push("/login");
      // Remove auth header
    },
  },
  actions: {
    async fetchProducts({ commit, state }) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/products`,

          { headers: { Authorization: `Bearer ${state.token}` } }
        );
        commit("SET_PRODUCTS", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async fetchOrders({ commit, state }) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/orders`,
          {
            headers: { Authorization: `Bearer ${state.token}` },
          }
        );
        commit("SET_ORDERS", response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async placeOrder({ state, commit }) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify({
              user_id: 1, // Change this dynamically
              customer_name: state.user.name,
              customer_email: state.user.email,
              shipping_address: state.user.address,
              items: state.cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
              })),
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          commit("SET_CART", []);
          return { success: true, message: result.message };
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        return { success: false, message: "Failed to place order." };
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
    async deleteOrder({ commit, state }, { id }) {
      const toast = useToast();
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/admin/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      toast.success("Order deleted successfully!", { timeout: 2000 });
      // dispatch("fetchOrders");
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

        const { access_token, user: userData } = response.data;

        commit("SET_TOKEN", access_token);
        commit("SET_USER", userData);

        localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
        localStorage.setItem("token", access_token);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`; // Set global auth header
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    },

    async register(
      { commit },
      { name, email, password, password_confirmation }
    ) {
      const toast = useToast();
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/register`,
          {
            name,
            email,
            password,
            password_confirmation,
          }
        );
        const { user, token } = response.data;
        commit("setUser", user);
        commit("setToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        toast.success("User registered successfully!", { timeout: 2000 });
      } catch (err) {
        console.log("Error ", err);
        throw err; // Handle errors here
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
