<template>
  <nav>
    <form action="#">
      <div class="input-group">
        <input type="text" class="input-field" placeholder="Search..." />
        <button class="btn" type="button">
          <i class="bx bx-search-big"></i>
        </button>
      </div>
    </form>
    <div class="nav-content">
      <ul class="nav-account">
        <li class="user-link">
          <a href="#">
            <img
              src="../../../assets/img/account.jpg"
              alt="account"
              class="avatar"
            />
          </a>
          <div class="user-link-dropdown">
            <a href="#" class="user-dropdown">
              <i class="bx bxs-user"></i>
              <span>Profile</span>
            </a>
            <a href="#" class="user-dropdown">
              <i class="bx bxs-chart-line"></i>
              <span>Analytics</span>
            </a>
            <a href="#" class="user-dropdown">
              <i class="bx bxs-cog"></i>
              <span>Setting</span>
            </a>
            <div class="divider"></div>
            <a href="#" class="user-dropdown">
              <i class="bx bxs-help-circle"></i>
              <span>Help Center</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>
