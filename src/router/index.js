import { createRouter, createWebHistory } from "vue-router";

// Import layouts
import AdminLayout from "@/views/admin/AdminLayout.vue";
import MainLayout from "@/components/layout/MainLayout.vue";

// Import client pages
import HomePage from "@/views/client/HomePage.vue";
import NotificationsPage from "@/views/client/NotificationsPage.vue";
import DemoPage from "@/views/client/DemoPage.vue";
import CheckoutPage from "@/views/client/CheckoutPage.vue";
import OrderSuccess from "@/views/client/OrderSuccess.vue";
import Cart from "@/views/client/Cart.vue";
import DetailProduct from "@/views/client/DetailProduct.vue";
import Trend from "@/views/client/Trend.vue";
import PoliciesPage from "@/views/client/PoliciesPage.vue";

// Import profile components
import ProfileLayout from "@/views/client/profile/ProfileLayout.vue";
import ProfileInfo from "@/views/client/profile/ProfileInfo.vue";
import ProfileOrders from "@/views/client/profile/ProfileOrders.vue";
import ProfileAddresses from "@/views/client/profile/ProfileAddresses.vue";
import ProfileChangePassword from "@/views/client/profile/ProfileChangePassword.vue";
import ProfileVouchers from "@/views/client/profile/ProfileVouchers.vue";
import ProfileBPoint from "@/views/client/profile/ProfileBPoint.vue";
import ProfileNotifications from "@/views/client/profile/ProfileNotifications.vue";
import ProfileFavorites from "@/views/client/profile/ProfileFavorites.vue";
import ProfileReviews from "@/views/client/profile/ProfileReviews.vue";
import ProfileInvoice from "@/views/client/profile/ProfileInvoice.vue";
import ProfileBenefits from "@/views/client/profile/ProfileBenefits.vue";

// Import admin components
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
import RefundManagement from "@/views/admin/views-admin/RefundManagement.vue";
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

import ProductCatalog from "@/views/client/ProductCatalog.vue";


import AuthPage from "@/views/AuthPage.vue";
import { showToast } from "@/utils/swalHelper";
import ResetPassword from "@/views/ResetPassword.vue";

import UserVoucher from "@/views/admin/views-admin/UserVoucher.vue";
import POSView from "@/views/admin/views-admin/POSView.vue";
import OrderFail from "@/views/client/OrderFail.vue";

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
          path: "demo",
          name: "demo",
          component: DemoPage,
        },
        {
          path: "checkout",
          name: "checkout",
          component: CheckoutPage
        },
        {
          path: "checkout/:sessionId",
          name: "checkout-session",
          component: CheckoutPage,
          props: true,
        },
        {
          path: "order/success/:orderId",
          name: "order-success",
          component: OrderSuccess,
          props: true,
        },
        {
          path: "order/fail",
          name: "order-fail",
          component: OrderFail,
        },
        {
          path: "cart",
          name: "cart",
          component: Cart,
        },
        {
          path: "product/:id",
          name: "product-detail",
          component: DetailProduct,
          props: true,
        },
        {
          path: "trend",
          name: "trend",
          component: Trend,
        },
        {
          path: "policies",
          name: "policies",
          component: PoliciesPage,
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileLayout,
          redirect: "/profile/info", // Tự động chuyển đến profile info
          children: [
            {
              path: "info",
              name: "profile-info",
              component: ProfileInfo,
            },
            {
              path: "orders",
              name: "profile-orders",
              component: ProfileOrders,
            },
            {
              path: "addresses",
              name: "profile-addresses",
              component: ProfileAddresses,
            },
            {
              path: "change-password",
              name: "profile-change-password",
              component: ProfileChangePassword,
            },
            {
              path: "invoice",
              name: "profile-invoice",
              component: ProfileInvoice,
            },
            {
              path: "benefits",
              name: "profile-benefits",
              component: ProfileBenefits,
            },
            {
              path: "vouchers",
              name: "profile-vouchers",
              component: ProfileVouchers,
            },
            {
              path: "bpoint",
              name: "profile-bpoint",
              component: ProfileBPoint,
            },
            {
              path: "notifications",
              name: "profile-notifications",
              component: ProfileNotifications,
            },
            {
              path: "favorites",
              name: "profile-favorites",
              component: ProfileFavorites,
            },
            {
              path: "reviews",
              name: "profile-reviews",
              component: ProfileReviews,
            },
            {
              path: "invoice",
              name: "profile-invoice",
              component: ProfileInvoice,
            },
            {
              path: "benefits",
              name: "profile-benefits",
              component: ProfileBenefits,
            },
          ],
        },
        {
          path: "/products",
          name: "product-catalog",
          component: ProductCatalog,
        },

      ],
    },
    // Trang auth, không thuộc parent nào
    {
      path: "/auth",
      name: "auth",
      component: AuthPage,
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword,
    },
    // Admin routes
    {
      path: "/admin",
      component: AdminLayout,
      children: [
        {
          path: "",
          redirect: "/admin/dashboard",
        },
        {
          path: "dashboard",
          name: "Thống kê",
          component: Dashboard,
        },
        {
          path: "order",
          name: "Đơn hàng",
          component: Order,
        },
       
        {
          path: "refund-management",
          name: "Quản lý hoàn tiền",
          component: RefundManagement,
        },
        {
          path: "account",
          name: "Tài khoản",
          component: Account,
        },
        {
          path: "notification",
          name: "Thông báo",
          component: Notifications,
        },
        {
          path: "user",
          name: "Người dùng",
          component: User,
        },
        {
          path: "book",
          name: "Sách",
          component: Book,
        },
        {
          path: "author",
          name: "Tác giả",
          component: Author,
        },
        {
          path: "review",
          name: "Đánh giá",
          component: Review,
        },
        {
          path: "flash-sale",
          name: "Giảm giá nhanh",
          component: Flash_Sale,
        },
        {
          path: "flash-sale/:id",
          name: "Chi tiết giảm giá nhanh",
          component: Flash_Sale_Item,
          props: true,
        },
        {
          path: "category",
          name: "Thể loại",
          component: Category,
        },
        {
          path: "voucher",
          name: "Phiếu giảm giá",
          component: Voucher,
        },
        {
          path: "userVoucher/:id",
          name: "Phiếu giảm giá của người dùng",
          component: UserVoucher,
          props: true,
        },
        {
          path: "supplier",
          name: "Nhà cung cấp",
          component: Supplier,
        },
        {
          path: "publisher",
          name: "Nhà xuất bản",
          component: () => import("@/views/admin/views-admin/Publisher.vue"),
        },
        {
          path: "rank",
          name: "Hạng",
          component: Rank,
        },
        {
          path: "rank/:id",
          name: "Chi tiết hạng",
          component: RankDetail,
          props: true,
        },
        {
          path: "point",
          name: "Điểm",
          component: Point,
        },
        {
          path: "template",
          name: "Mẫu",
          component: Template,
        },
        {
          path: "event",
          name: "Sự kiện",
          component: Event,
        },
        {
          path: "event-category",
          name: "Danh mục sự kiện",
          component: EventCategory,
        },
        {
          path: "event-gift",
          name: "Quà tặng sự kiện",
          component: EventGift,
        },
        {
          path: "event-participant",
          name: "Người tham gia sự kiện",
          component: EventParticipant,
        },
        {
          path: "event-gift-claim",
          name: "Nhận quà sự kiện",
          component: EventGiftClaim,
        },
        {
          path: "event-history",
          name: "Lịch sử sự kiện",
          component: EventHistory,
        },
        {
          path: "pos-view",
          name: "Bán hàng tại quầy",
          component: POSView,
        },
      ],
      // End - Admin routes
    },
  ],
});

// tự động chuyển hướng về trang đăng nhập nếu token hết hạn
const allowRoutes = ['/auth', '/reset-password']


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');
  if (!token && !allowRoutes.includes(to.path)) {
    showToast('error', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    next('/auth');
  } else {
    next();
  }
});

export default router;
