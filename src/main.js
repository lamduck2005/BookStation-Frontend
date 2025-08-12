import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@/assets/css/admin-table-responsive.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "vue-multiselect/dist/vue-multiselect.css";
import "@/assets/css/vue-multiselect.css"; //css tùy chỉnh
// import "@/assets/admin/styles.css";
// import "@/assets/admin/script.js";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Multiselect from "vue-multiselect";
const app = createApp(App);

app.component('Multiselect', Multiselect);

app.use(router);
app.mount("#app");
