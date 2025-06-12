<template>
  <!-- Main Sidebar Begins  -->
  <aside id="sidebar">
    <div class="sidebar-widget">
      <div class="sidebar-logo">
        <!-- <img src="../../assets/img/logo.png" alt="" /> -->
        <router-link to="/admin" class="sidebar-logo-link">
          <!-- <img src="../../../assets/img/logo.png" alt="BookStation Logo" /> -->
          <a href="#">BookStation</a>
        </router-link>
      </div>
      <button class="toggle-btn" type="button">
        <i id="icon" class="bx bxs-chevrons-right"></i>
      </button>
    </div>
    <!-- Sidebar Navigation -->
    <ul class="sidebar-nav">
      <!-- 1 -->
      <li class="sidebar-item">
        <router-link to="/admin/account" class="sidebar-link">
          <i class="bx bxs-user-circle"></i>
          <span>Account</span>
        </router-link>
      </li>
      <!-- 2 -->
      <li class="sidebar-item">
        <router-link to="/admin/dashboard" class="sidebar-link">
          <i class="bx bxs-layers"></i>
          <span>Dashboard</span>
        </router-link>
      </li>
      <!-- 2 -->
      <li class="sidebar-item">
        <router-link to="/admin/order" class="sidebar-link">
          <i class="bxr bx-box" style="color: #ffffff"></i>
          <span>Order</span>
        </router-link>
      </li>
      <!-- 3 -->
      <li class="sidebar-item">
        <a href="#" class="sidebar-link has-dropdown">
          <i class="bx bxs-bug-alt"></i>
          <span>Manage</span>
        </a>
        <ul class="sidebar-dropdown">
          <li class="sidebar-item">
            <router-link to="/admin/user" class="sidebar-link"
              >User</router-link
            >
            <router-link to="/admin/product" class="sidebar-link"
              >Book</router-link
            >
            <router-link to="/admin/author" class="sidebar-link"
              >Author</router-link
            >
            <router-link to="/admin/review" class="sidebar-link"
              >Review</router-link
            >
            <router-link to="/admin/flash-sale" class="sidebar-link"
              >Flash Sale</router-link
            >
            <router-link to="/admin/category" class="sidebar-link"
              >Category</router-link
            >
            <router-link to="/admin/voucher" class="sidebar-link"
              >Voucher</router-link
            >
            <router-link to="/admin/supplier" class="sidebar-link"
              >Supplier</router-link
            >
            <router-link to="/admin/rank" class="sidebar-link"
              >Rank</router-link
            >
            <router-link to="/admin/point" class="sidebar-link"
              >Point</router-link
            >
          </li>
        </ul>
      </li>
      <!-- 4 -->
      <li class="sidebar-item">
        <router-link to="/admin/notification" class="sidebar-link">
          <i class="bx bx-bell-ring" style="color: #ffffff"></i>
          <span>Notifications</span>
        </router-link>
      </li>
    </ul>
    <div class="sidebar-footer">
      <a href="#" class="sidebar-link">
        <i class="bx bxs-arrow-out-up-right-circle"></i>
        <span>Logout</span>
      </a>
    </div>
  </aside>

  <!-- Main Sidebar Begins End  -->
</template>

<style>
#sidebar {
  display: flex;
  flex-direction: column;
  width: 90px;
  min-width: 90px;
  transition: all 0.35s ease-in-out;
  background-color: #111111;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  overflow-y: auto;
}
#sidebar.expand {
  width: 300px;
  min-width: 300px;
}
.sidebar-widget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #606164;
}
.toggle-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 0.425rem;
  font-size: 28px;
  background-color: #323c55;
  border: none;
}
#sidebar:not(.expand) .sidebar-logo,
#sidebar:not(.expand) a.sidebar-link span {
  display: none;
}
.sidebar-logo a {
  color: #fff;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: -115px;
}
.sidebar-nav {
  padding: 0;
  flex: 1 1 auto;
}
a.sidebar-link {
  padding: 1.025rem 1.625rem;
  color: #fff;
  display: flex;
  align-items: center;
  font-weight: 700;
  white-space: nowrap;
  border-left: 3px solid transparent;
}
.sidebar-link i {
  font-size: 1.775rem;
  margin-right: 0.75rem;
}
.sidebar-item {
  position: relative;
  margin: 5px 0;
}
.sidebar-item .sidebar-dropdown {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  padding: 0;
  width: 100%;
  transition: opacity 200ms linear, max-height 200ms linear;
  will-change: opacity, max-height;
}
.sidebar-dropdown .sidebar-item {
  font-size: 0.965rem;
}
#sidebar.expand .sidebar-item .has-dropdown.active + .sidebar-dropdown {
  display: block;
  max-height: 55em;
  transition: all 200ms linear;
  opacity: 1;
}
#sidebar.expand .sidebar-link.has-dropdown::after {
  content: "";
  display: inline-block;
  padding: 2px;
  position: absolute;
  right: 1.5rem;
  top: 1.4rem;
  transform: rotate(45deg);
  transition: all 0.2s ease-out;
  border: solid;
  border-width: 0 0.075rem 0.075rem 0;
}
#sidebar.expand .sidebar-link.has-dropdown.active::after {
  transform: rotate(-135deg);
  transition: all 0.2s ease-out;
}
.sidebar-dropdown a.sidebar-link {
  position: relative;
  overflow: hidden;
}
.sidebar-dropdown a.sidebar-link::after {
  content: "";
  position: absolute;
  left: 1.2rem;
  bottom: 0.2rem;
  width: 0;
  height: 3px;
  background-color: #bb1b30;
  transition: width 0.3s ease;
}
.sidebar-dropdown a.sidebar-link:hover::after {
  width: 50%;
}
</style>
