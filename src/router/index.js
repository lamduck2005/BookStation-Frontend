import { createRouter, createWebHistory } from "vue-router";
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
import Order from "@/views/admin/views-admin/Order.vue";
import Supplier from "@/views/admin/views-admin/Supplier.vue";
import Rank from "@/views/admin/views-admin/Rank.vue";
import Point from "@/views/admin/views-admin/Point.vue";
import Flash_Sale_Item from "@/views/admin/views-admin/flash-sale-item/Flash_Sale_Item.vue";
import AdminLayoutTest from "@/views/admin/AdminLayoutTest.vue";
import RankDetail from "@/views/admin/views-admin/RankDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: AdminLayoutTest,
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
          path: "order",
          name: "order",
          component: Order,
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
          path: "flash-sale/:id/items",
          name: "flash-sale-item",
          component: Flash_Sale_Item,
          props: true,
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
        {
          path: "supplier",
          name: "supplier",
          component: Supplier,
        },
        {
          path: "rank",
          name: "rank",
          component: Rank,
        },
        {
          path: "rank/:id",
          name: "rank-detail",
          component: RankDetail,
          props: true,
        },
        {
          path: "point",
          name: "point",
          component: Point,
        },
      ],
      // End - Admin routes
    },
  ],
});

export default router;
