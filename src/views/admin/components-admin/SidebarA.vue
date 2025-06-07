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
              >Product</router-link
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
