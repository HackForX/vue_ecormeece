// import './assets/main.css'
import store from "./store";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/tailwind.css";
// import "material-icons/iconfont/material-icons.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const app = createApp(App);

app.use(router);
app.use(store);
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: "Vue-Toastification__bounce",
});
app.mount("#app");
