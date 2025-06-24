<template>
  <nav :id="'sidebar'" :class="{ close: isSidebarClosed }">
    <ul>
      <li>
        <span class="logo">BookStation</span>
        <button @click="toggleSidebar" id="toggle-btn">
          <i class="bi bi-chevron-double-left"></i>
        </button>
      </li>
      <li>
        <router-link to="/admin/account">
          <i class="bi bi-person-circle"></i>
          <span>Account</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/dashboard">
          <i class="bi bi-bar-chart"></i>
          <span>Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/admin/order">
          <i class="bi bi-box"></i>
          <span>Order</span>
        </router-link>
      </li>
      <li>
        <button @click="toggleSubMenu(0)" class="dropdown-btn" :class="{ rotate: openSubMenuIndex === 0 }">
          <i class="bi bi-gear"></i>
          <span>Manage</span>
          <i class="bi bi-chevron-down"></i>
        </button>
        <ul class="sub-menu" :class="{ show: openSubMenuIndex === 0 }">
          <div>
            <li><router-link to="/admin/user"><i class="bi bi-people"></i> User</router-link></li>
            <li><router-link to="/admin/product"><i class="bi bi-book"></i> Book</router-link></li>
            <li><router-link to="/admin/author"><i class="bi bi-pen"></i> Author</router-link></li>
            <li><router-link to="/admin/review"><i class="bi bi-chat-dots"></i> Review</router-link></li>
            <li><router-link to="/admin/flash-sale"><i class="bi bi-lightning"></i> Flash Sale</router-link></li>
            <li><router-link to="/admin/category"><i class="bi bi-tags"></i> Category</router-link></li>
            <li><router-link to="/admin/voucher"><i class="bi bi-ticket"></i> Voucher</router-link></li>
            <li><router-link to="/admin/supplier"><i class="bi bi-truck"></i> Supplier</router-link></li>
            <li><router-link to="/admin/rank"><i class="bi bi-star"></i> Rank</router-link></li>
            <li><router-link to="/admin/point"><i class="bi bi-coin"></i> Point</router-link></li>
          </div>
        </ul>
      </li>
      <li>
        <router-link to="/admin/notification">
          <i class="bi bi-bell"></i>
          <span>Notifications</span>
        </router-link>
      </li>
      <li>
        <a href="#">
          <i class="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isSidebarClosed: Boolean
})
const emit = defineEmits(['toggleSidebar'])
const openSubMenuIndex = ref(null)

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
  overflow: hidden;
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