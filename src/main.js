import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
// import "@/assets/admin/styles.css";
// import "@/assets/admin/script.js";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
const app = createApp(App);

app.use(router);
app.mount("#app");
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
