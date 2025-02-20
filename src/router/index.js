import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CartView from "../views/CartView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import AdminView from "../views/AdminView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AppLayout from "../views/AppLayout.vue";
import store from "../store";
const routes = [
  {
    path: "/",
    component: AppLayout, // Wrap views with a PrimeVue layout (optional)
    redirect: "/login",
    children: [
      { path: "", name: "Home", component: HomeView },
      { path: "cart", name: "Cart", component: CartView },
      { path: "checkout", name: "Checkout", component: CheckoutView },
      { path: "admin", name: "Admin", component: AdminView },
      { path: "login", name: "Login", component: LoginView },
      { path: "register", name: "Register", component: RegisterView },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(), // Replaces mode: "history"
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const isAdmin = store.getters.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next("/");
  } else if (to.meta.guest && isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
