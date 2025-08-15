<template>
  <nav :id="'sidebar'" :class="{ close: isSidebarClosed }">
    <ul>
      <li>
        <div class="d-flex justify-content-center align-items-center w-100">
          <img src="@/assets/img/sidebar-logo.png" alt="BookStation" class="logo-img" />
        </div>
        <!-- nút đóng mở sidebar -->
        <button @click="toggleSidebar" id="toggle-btn">
          <i :class="isSidebarClosed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left'"></i>
        </button>
      </li>

      <!-- Tự động sinh menu từ mảng sidebarLinks -->
      <template v-for="(link, index) in sidebarLinks" :key="index">
        <li v-if="link.type === 'link'">
          <router-link :to="link.to">
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
          </router-link>
        </li>

        <li v-else-if="link.type === 'submenu'">
          <button
            @click="toggleSubMenu(index)"
            class="dropdown-btn"
            :class="{ 
              rotate: openSubMenuIndex === index,
              'parent-active': isParentActive(link)
            }"
          >
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
            <i class="bi bi-chevron-down"></i>
          </button>
          <ul class="sub-menu" :class="{ show: openSubMenuIndex === index }">
            <div>
              <li v-for="(subLink, subIndex) in link.subLinks" :key="subIndex">
                <router-link :to="subLink.to">
                  <i :class="subLink.icon"></i> {{ subLink.label }}
                </router-link>
              </li>
            </div>
          </ul>
        </li>

        <li v-else-if="link.type === 'action'">
          <a href="#" @click.prevent="link.action">
            <i :class="link.icon"></i>
            <span>{{ link.label }}</span>
          </a>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
import router from "@/router";
import { showQuickConfirm, showToast } from "@/utils/swalHelper";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  isSidebarClosed: Boolean,
});
const emit = defineEmits(["toggleSidebar"]);
const openSubMenuIndex = ref(null);
const route = useRoute();

// Danh sách các link sidebar
const sidebarLinks = [
  {
    type: "link",
    to: "/admin/account",
    icon: "bi bi-person-circle",
    label: "Tài khoản",
  },
  {
    type: "link",
    to: "/admin/dashboard",
    icon: "bi bi-bar-chart",
    label: "Bảng điều khiển",
  },
  {
    type: "link",
    to: "/admin/order",
    icon: "bi bi-box",
    label: "Đơn hàng",
  },
  {
    type: "link",
    to: "/admin/refund-management",
    icon: "bi bi-arrow-return-left",
    label: "Quản lý hoàn tiền",
  },
  {
    type: "link",
    to: "/admin/pos-view",
    icon: "bi bi-cart",
    label: "Bán hàng tại quầy",
  },
  {
    type: "submenu",
    icon: "bi bi-gear",
    label: "Quản lý",
    subLinks: [
      { to: "/admin/user", icon: "bi bi-people", label: "Người dùng" },
      { to: "/admin/book", icon: "bi bi-book", label: "Sách" },
      { to: "/admin/author", icon: "bi bi-pen", label: "Tác giả" },
      { to: "/admin/review", icon: "bi bi-chat-dots", label: "Đánh giá" },
      {
        to: "/admin/flash-sale",
        icon: "bi bi-lightning",
        label: "Giảm giá nhanh",
      },
      { to: "/admin/category", icon: "bi bi-tags", label: "Thể loại" },
      { to: "/admin/voucher", icon: "bi bi-ticket", label: "Phiếu giảm giá" },
      { to: "/admin/supplier", icon: "bi bi-truck", label: "Nhà cung cấp" },
      {
        to: "/admin/publisher",
        icon: "bi bi-journal-bookmark",
        label: "Nhà xuất bản",
      },
      { to: "/admin/rank", icon: "bi bi-star", label: "Hạng" },
      { to: "/admin/point", icon: "bi bi-coin", label: "Điểm" },
    ],
  },
  {
    type: "submenu",
    icon: "bi bi-calendar-event",
    label: "Sự kiện",
    subLinks: [
      {
        to: "/admin/event",
        icon: "bi bi-calendar-check",
        label: "Quản lý sự kiện",
      },
      {
        to: "/admin/event-category",
        icon: "bi bi-calendar3",
        label: "Danh mục sự kiện",
      },
      {
        to: "/admin/event-gift",
        icon: "bi bi-gift",
        label: "Quà tặng sự kiện",
      },
      {
        to: "/admin/event-gift-claim",
        icon: "bi bi-gift-fill",
        label: "Nhận quà sự kiện",
      },
      {
        to: "/admin/event-history",
        icon: "bi bi-clock-history",
        label: "Lịch sử sự kiện",
      },
      {
        to: "/admin/event-participant",
        icon: "bi bi-people-fill",
        label: "Người tham gia sự kiện",
      },
    ],
  },
  {
    type: "link",
    to: "/admin/notification",
    icon: "bi bi-bell",
    label: "Thông báo",
  },
  // {
  //   type: "action",
  //   icon: "bi bi-box-arrow-right",
  //   label: "Đăng xuất",
  //   action: () => {
  //     handleLogout();
  //   }, // TODO: Thêm logic đăng xuất
  // },
];

function toggleSidebar() {
  emit("toggleSidebar", !props.isSidebarClosed);
  openSubMenuIndex.value = null;
}

function toggleSubMenu(idx) {
  if (openSubMenuIndex.value === idx) {
    openSubMenuIndex.value = null;
  } else {
    openSubMenuIndex.value = idx;
    if (props.isSidebarClosed) emit("toggleSidebar", false);
  }
}

// Function to check if parent menu should be active
const isParentActive = (parentLink) => {
  if (parentLink.type !== 'submenu' || !parentLink.subLinks) return false;
  return parentLink.subLinks.some(subLink => route.path === subLink.to);
};

</script>

<style scoped>
#sidebar {
  box-sizing: border-box;
  height: 100vh;
  width: 250px;
  padding: 5px 0;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-right: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  align-self: start;
  transition: 300ms ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
  text-wrap: nowrap;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#sidebar.close {
  padding: 5px 0;
  width: 50px !important;
  min-width: 50px !important;
}
#sidebar > ul {
  list-style: none;
  padding-left: 5px;
}
#sidebar > ul > li:first-child {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
#sidebar .logo-img {
  height: 50px;
  width: auto;
  object-fit: cover;
  object-position: center;
  transition: opacity 0.3s ease, display 0.3s ease;
}

#sidebar.close .logo-img {
  opacity: 0;
  display: none;
}
#sidebar > ul > li.active > a {
  background: linear-gradient(135deg, #8b7fb8 0%, #a594d1 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(139, 127, 184, 0.3);
}
#sidebar > ul > li.active > a i {
  color: white;
}
#sidebar a,
#sidebar .dropdown-btn,
#sidebar .logo {
  border-radius: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2px 8px;
  position: relative;
  overflow: hidden;
}
#sidebar .dropdown-btn {
  width: calc(100% - 16px);
  text-align: left;
  background: none;
  border: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}
#sidebar a i,
#sidebar .dropdown-btn i {
  flex-shrink: 0;
  color: #718096;
  font-size: 16px;
  transition: all 0.3s ease;
}
#sidebar a span,
#sidebar .dropdown-btn span {
  flex-grow: 1;
  font-weight: 500;
  opacity: 1;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}
#sidebar a:hover,
#sidebar .dropdown-btn:hover {
  background: linear-gradient(135deg, rgba(139, 127, 184, 0.1) 0%, rgba(165, 148, 209, 0.15) 100%);
  /* color: #8b7fb8; */
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(139, 127, 184, 0.15);
}
#sidebar a:hover i,
#sidebar .dropdown-btn:hover i {
  color: #8b7fb8;
  transform: scale(1.1);
}
#sidebar .router-link-active {
  background: linear-gradient(135deg, #6b5b95 0%, #8b7fb8 50%, #a594d1 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 127, 184, 0.3);
  transform: translateX(4px);
  border-left: 3px solid #5a4a7a;
  margin-left: 5px;
  padding-left: 13px;
}
#sidebar .router-link-active i {
  color: white;
}
#sidebar .router-link-active:hover {
  background: linear-gradient(135deg, #5a4a7a 0%, #7a6fa7 50%, #9483c0 100%);
  transform: translateX(6px);
  border-left: 3px solid #4a3a6a;
}
#sidebar .sub-menu {
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;
  margin-left: 0px;
  position: relative;
}
#sidebar .sub-menu:before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #e2e8f0, #cbd5e0);
  border-radius: 1px;
}
#sidebar .sub-menu > div {
  overflow: hidden;
}
#sidebar .sub-menu.show {
  grid-template-rows: 1fr;
}
#sidebar .dropdown-btn i:last-child {
  transition: transform 0.3s ease;
  margin-left: auto;
}
#sidebar .rotate i:last-child {
  transform: rotate(180deg);
}
#sidebar .sub-menu a {
  padding: 10px 16px 10px 28px;
  font-size: 13px;
  margin: 1px 4px;
  border-radius: 8px;
  position: relative;
}
#sidebar .sub-menu a:before {
  content: '';
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e0;
  transition: all 0.3s ease;
}
#sidebar .sub-menu a:hover:before {
  background: #8b7fb8;
  transform: translateY(-50%) scale(1.3);
}
#sidebar .sub-menu .router-link-active {
  background: linear-gradient(135deg, #6b5b95 0%, #8b7fb8 50%, #a594d1 100%);
  border-left: 3px solid #5a4a7a;
  margin-left: 4px;
  /* padding-left: 25px; */
}
#sidebar .sub-menu .router-link-active:before {
  background: white;
  transform: translateY(-50%) scale(1.3);
}
/* Parent menu active state when submenu is active */
#sidebar .dropdown-btn.parent-active {
  background: linear-gradient(135deg, rgba(139, 127, 184, 0.15) 0%, rgba(165, 148, 209, 0.2) 100%);
  color: #8b7fb8;
  border-left: 3px solid #8b7fb8;
  margin-left: 5px;
  padding-left: 13px;
}
#sidebar .dropdown-btn.parent-active i {
  color: #8b7fb8;
}
#sidebar #toggle-btn {
  margin-left: auto;
  padding: 1em;
  border: none;
  border-radius: 0.5em;
  background: none;
  cursor: pointer;
}
#sidebar #toggle-btn svg {
  transition: rotate 150ms ease;
}
#sidebar #toggle-btn:hover {
  background-color: var(--hover-clr);
}

/* Adjustments for collapsed sidebar */
#sidebar.close a,
#sidebar.close .dropdown-btn {
  width: auto;
  margin: 2px 0;
  padding: 12px 8px;
  justify-content: center;
  transform: translateX(0);
}

#sidebar.close a span,
#sidebar.close .dropdown-btn span {
  opacity: 0;
}

#sidebar.close .dropdown-btn i:last-child {
  opacity: 0;
}

#sidebar.close .router-link-active {
  margin-left: 0;
  padding-left: 8px;
  border-left: none;
  border-right: 3px solid #5a4a7a;
  transform: translateX(-2px);
}

/* #sidebar.close .router-link-active:hover {
  border-right: 3px solid #4a3a6a;
  border-left: none;
  transform: translateX(-4px);
} */

#sidebar.close .dropdown-btn.parent-active {
  margin-left: 0;
  padding-left: 8px;
  border-left: none;
  border-right: 3px solid #8b7fb8;
  transform: translateX(-2px);
}

#sidebar.close .router-link-active i,
#sidebar.close .dropdown-btn.parent-active i:first-child {
  transform: translateX(6px);
}

#sidebar.close a:hover,
#sidebar.close .dropdown-btn:hover {
  transform: translateX(0);
}

#sidebar.close .sub-menu {
  display: none;
}
</style>
