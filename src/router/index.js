import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../views/admin/AdminLayout.vue";
import MainLayout from "../components/layout/MainLayout.vue";
import HomePage from "@/views/client/HomePage.vue";
import NotificationsPage from "@/views/client/NotificationsPage.vue";
import DemoPage from "@/views/client/DemoPage.vue";
import CheckoutPage from "@/views/client/CheckoutPage.vue";
import Cart from "@/views/client/Cart.vue";
import DetailProduct from "@/views/client/DetailProduct.vue";
import Trend from "@/views/client/Trend.vue";
import User from "@/views/admin/views-admin/User.vue";
import Product from "@/views/admin/views-admin/Product.vue";
import Book from "@/views/admin/views-admin/Book.vue";
import Author from "@/views/admin/views-admin/Author.vue";
import Review from "@/views/admin/views-admin/Review.vue";
import Flash_Sale from "@/views/admin/views-admin/FlashSale.vue";
import Category from "@/views/admin/views-admin/Category.vue";
import Voucher from "@/views/admin/views-admin/Voucher.vue";
import Dashboard from "@/views/admin/set-up/Dashboard.vue";
import Account from "@/views/admin/set-up/Account.vue";
import Notifications from "@/views/admin/set-up/Notifications.vue";
import Order from "@/views/admin/views-admin/Order.vue";
import Supplier from "@/views/admin/views-admin/Supplier.vue";
import Rank from "@/views/admin/views-admin/Rank.vue";
import Point from "@/views/admin/views-admin/Point.vue";
import Flash_Sale_Item from "@/views/admin/views-admin/FlashSaleDetail.vue";
import RankDetail from "@/views/admin/views-admin/RankDetail.vue";
import Template from "@/views/admin/views-admin/Template.vue";
import Event from "@/views/admin/views-admin/Event.vue";
import EventCategory from "@/views/admin/views-admin/EventCategory.vue";
import EventGift from "@/views/admin/views-admin/EventGift.vue";
import EventParticipant from "@/views/admin/views-admin/EventParticipant.vue";
import EventGiftClaim from "@/views/admin/views-admin/EventGiftClaim.vue";
import EventHistory from "@/views/admin/views-admin/EventHistory.vue";

import LoginPage from "@/views/LoginPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Client routes với MainLayout
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomePage,
        },
        {
          path: "notifications",
          name: "notifications",
          component: NotificationsPage,
        },
        {
          path: "demo",
          name: "demo",
          component: DemoPage,
        },
        {
          path: "checkout",
          name: "checkout",
          component: CheckoutPage,
        },
        {
          path: "cart",
          name: "cart",
          component: Cart,
        },
        {
          path: "trend",
          name: "trend",
          component: Trend,
        },
        {
          path: "product/:id",
          name: "product-detail",
          component: DetailProduct,
          props: true,
        },
      ]
    },
    // Login page without layout
    {
      path: "/login",
      name: "login",
      component: LoginPage,
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
          name: "Dashboard",
          component: Dashboard,
        },
        {
          path: "order",
          name: "Order",
          component: Order,
        },
        {
          path: "account",
          name: "Account",
          component: Account,
        },
        {
          path: "notification",
          name: "Notifications",
          component: Notifications,
        },
        {
          path: "user",
          name: "User",
          component: User,
        },
        {
          path: "book",
          name: "Book",
          component: Book,
        },
        {
          path: "author",
          name: "Author",
          component: Author,
        },
        {
          path: "review",
          name: "Review",
          component: Review,
        },
        {
          path: "flash-sale",
          name: "Flash Sale",
          component: Flash_Sale,
        },
        {
          path: "flash-sale/:id",
          name: "Flash Sale Item",
          component: Flash_Sale_Item,
          props: true,
        },
        {
          path: "category",
          name: "Category",
          component: Category,
        },
        {
          path: "voucher",
          name: "Voucher",
          component: Voucher,
        },
        {
          path: "supplier",
          name: "Supplier",
          component: Supplier,
        },
        {
          path: "rank",
          name: "Rank",
          component: Rank,
        },
        {
          path: "rank/:id",
          name: "Rank detail",
          component: RankDetail,
          props: true,
        },
        {
          path: "point",
          name: "Point",
          component: Point,
        },
        {
          path: "template",
          name: "Template",
          component: Template,
        },
        {
          path: "event",
          name: "event",
          component: Event,
        },
        {
          path: "event-category",
          name: "event-category",
          component: EventCategory,
        },
        {
          path: "event-gift",
          name: "event-gift",
          component: EventGift,
        },
        {
          path: "event-participant",
          name: "event-participant",
          component: EventParticipant,
        },
        {
          path: "event-gift-claim",
          name: "event-gift-claim",
          component: EventGiftClaim,
        },
        {
          path: "event-history",
          name: "event-history",
          component: EventHistory,
        },
      ],
      // End - Admin routes
    },
  ],
});

export default router;
