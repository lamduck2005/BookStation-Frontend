<template>
  <nav :id="'sidebar'" :class="{ close: isSidebarClosed }" >
    <ul>
      <!-- nút đóng mở sidebar -->
      <li>
        <span class="logo">BookStation</span>
        <button @click="toggleSidebar" id="toggle-btn">
          <i class="bi bi-chevron-double-left"></i>
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
          <button @click="toggleSubMenu(index)" class="dropdown-btn" :class="{ rotate: openSubMenuIndex === index }">
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
import router from '@/router'
import { showQuickConfirm, showToast } from '@/utils/swalHelper'
import { ref, watch } from 'vue'

const props = defineProps({
  isSidebarClosed: Boolean
})
const emit = defineEmits(['toggleSidebar'])
const openSubMenuIndex = ref(null)

// Danh sách các link sidebar
const sidebarLinks = [
  {
    type: 'link',
    to: '/admin/account',
    icon: 'bi bi-person-circle',
    label: 'Tài khoản'
  },
  {
    type: 'link',
    to: '/admin/dashboard',
    icon: 'bi bi-bar-chart',
    label: 'Bảng điều khiển'
  },
  {
    type: 'link',
    to: '/admin/order',
    icon: 'bi bi-box',
    label: 'Đơn hàng'
  },
  {
    type: 'submenu',
    icon: 'bi bi-gear',
    label: 'Quản lý',
    subLinks: [
      { to: '/admin/user', icon: 'bi bi-people', label: 'Người dùng' },
      { to: '/admin/product', icon: 'bi bi-box', label: 'Sản phẩm' },
      { to: '/admin/book', icon: 'bi bi-book', label: 'Sách' },
      { to: '/admin/author', icon: 'bi bi-pen', label: 'Tác giả' },
      { to: '/admin/review', icon: 'bi bi-chat-dots', label: 'Đánh giá' },
      { to: '/admin/flash-sale', icon: 'bi bi-lightning', label: 'Flash Sale' },
      { to: '/admin/category', icon: 'bi bi-tags', label: 'Thể loại' },
      { to: '/admin/voucher', icon: 'bi bi-ticket', label: 'Voucher' },
      { to: '/admin/supplier', icon: 'bi bi-truck', label: 'Nhà cung cấp' },
      { to: '/admin/rank', icon: 'bi bi-star', label: 'Hạng' },
      { to: '/admin/point', icon: 'bi bi-coin', label: 'Điểm' },
    ]
  },
  {
    type: 'submenu',
    icon: 'bi bi-calendar-event',
    label: 'Sự kiện',
    subLinks: [
      { to: '/admin/event', icon: 'bi bi-calendar-check', label: 'Quản lý sự kiện' },
      { to: '/admin/event-category', icon: 'bi bi-calendar3', label: 'Danh mục sự kiện' },
      { to: '/admin/event-gift', icon: 'bi bi-gift', label: 'Quà tặng sự kiện' },
      { to: '/admin/event-gift-claim', icon: 'bi bi-gift-fill', label: 'Nhận quà sự kiện' },
      { to: '/admin/event-history', icon: 'bi bi-clock-history', label: 'Lịch sử sự kiện' },
      { to: '/admin/event-participant', icon: 'bi bi-people-fill', label: 'Người tham gia sự kiện' },
    ]
  },
  {
    type: 'link',
    to: '/admin/notification',
    icon: 'bi bi-bell',
    label: 'Thông báo'
  },
  {
    type: 'action',
    icon: 'bi bi-box-arrow-right',
    label: 'Đăng xuất',
    action: () => {
      handleLogout()
    } // TODO: Thêm logic đăng xuất
  }
]

function toggleSidebar() {
  emit('toggleSidebar', !props.isSidebarClosed)
  openSubMenuIndex.value = null
}

function toggleSubMenu(idx) {
  if (openSubMenuIndex.value === idx) {
    openSubMenuIndex.value = null
  } else {
    openSubMenuIndex.value = idx
    if (props.isSidebarClosed) emit('toggleSidebar', false)
  }
}

const handleLogout = () => {
  showQuickConfirm('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', 'question', 'Đăng xuất', 'Hủy', 'btn-danger', 'btn-secondary').then((result) => {
    if (result.isConfirmed) {
      showToast('success', 'Đăng xuất thành công');
      router.push('/login');
    }
  });
}
</script>

<style scoped>
#sidebar {
  box-sizing: border-box;
  height: 100vh;
  width: 250px;
  padding: 5px 0;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  align-self: start;
  transition: 300ms ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
  text-wrap: nowrap;
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
#sidebar .logo {
  font-weight: 600;
}
#sidebar > ul > li.active > a {
  color: var(--accent-clr);
}
#sidebar > ul > li.active > a svg {
  fill: var(--accent-clr);
}
#sidebar a,
#sidebar .dropdown-btn,
#sidebar .logo {
  border-radius: .5em;
  padding: .85em;
  text-decoration: none;
  color: var(--text-clr);
  display: flex;
  align-items: center;
  gap: 1em;
}
#sidebar .dropdown-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
}
#sidebar svg {
  flex-shrink: 0;
  fill: var(--text-clr);
}
#sidebar a span,
#sidebar .dropdown-btn span {
  flex-grow: 1;
}
#sidebar a:hover,
#sidebar .dropdown-btn:hover {
  background-color: #f0f0f0;
}
#sidebar .sub-menu {
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;
}
#sidebar .sub-menu > div {
  overflow: hidden;
}
#sidebar .sub-menu.show {
  grid-template-rows: 1fr;
}
#sidebar .dropdown-btn svg {
  transition: 200ms ease;
}
#sidebar .rotate svg:last-child {
  rotate: 180deg;
}
#sidebar .sub-menu a {
  padding-left: 2em;
}
#sidebar #toggle-btn {
  margin-left: auto;
  padding: 1em;
  border: none;
  border-radius: .5em;
  background: none;
  cursor: pointer;
}
#sidebar #toggle-btn svg {
  transition: rotate 150ms ease;
}
#sidebar #toggle-btn:hover {
  background-color: var(--hover-clr);
}
</style>