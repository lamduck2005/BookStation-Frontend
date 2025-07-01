import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../views/admin/AdminLayout.vue";
import HomePage from "@/views/client/HomePage.vue";
import NotificationsPage from "@/views/client/NotificationsPage.vue";
import DemoPage from "@/views/client/DemoPage.vue";
import CheckoutPage from "@/views/client/CheckoutPage.vue";
import Cart from "@/views/client/Cart.vue";
import DetailProduct from "@/views/client/DetailProduct.vue";
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
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/notifications",
      name: "notifications",
      component: NotificationsPage,
    },
    {
      path: "/demo",
      name: "demo",
      component: DemoPage,
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutPage,
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart,
    },
    {
      path: "/product/:id",
      name: "product-detail",
      component: DetailProduct,
      props: true,
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
          path: "book",
          name: "book", 
          component: Book,
        },
        {
          path: "author",
          name: "author",
          component: Author,
        },
        {
          path: "review",
          name: "Đánh giá",
          component: Review,
        },
        {
          path: "flash-sale",
          name: "Flash Sale",
          component: Flash_Sale,
        },
        {
          path: "flash-sale/:id",
          name: "Chi tiết Flash Sale",
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
        {
          path: "template",
          name: "template",
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
