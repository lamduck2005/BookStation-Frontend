import Test from "@/components/Test.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue"; // added import
import AboutView from "../views/AboutView.vue";
import AdminLayout from "../views/admin/AdminLayout.vue";
import User from "@/views/admin/views-admin/User.vue";
import Product from "@/views/admin/views-admin/Product.vue";
import Author from "@/views/admin/views-admin/Author.vue";
import Review from "@/views/admin/views-admin/Review.vue";
import Flash_Sale from "@/views/admin/views-admin/Flash_Sale.vue";
import Category from "@/views/admin/views-admin/Category.vue";
import Voucher from "@/views/admin/views-admin/Voucher.vue";
import Dashboard from "@/views/admin/set-up/Dashboard.vue";
import Account from "@/views/admin/set-up/Account.vue";
import Notifications from "@/views/admin/set-up/Notifications.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Test,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    // Admin routes
    {
      path: "/admin",
      component: () => AdminLayout,
      children: [
        {
          path: "",
          redirect: "/admin/dashboard",
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
        },
        {
          path: "account",
          name: "account",
          component: Account,
        },
        {
          path: "notification",
          name: "notification",
          component: Notifications,
        },
        {
          path: "user",
          name: "user",
          component: User,
        },
        {
          path: "product",
          name: "product",
          component: Product,
        },
        {
          path: "author",
          name: "author",
          component: Author,
        },
        {
          path: "review",
          name: "review",
          component: Review,
        },
        {
          path: "flash-sale",
          name: "flash-sale",
          component: Flash_Sale,
        },
        {
          path: "category",
          name: "category",
          component: Category,
        },
        {
          path: "voucher",
          name: "voucher",
          component: Voucher,
        },
      ],
      // End - Admin routes
    },
  ],
});

export default router;
