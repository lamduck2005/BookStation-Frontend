<template>
  <nav :id="'sidebar'" :class="{ close: isSidebarClosed }">
    <ul>
      <li>
        <span class="logo">BookStation</span>
        <button @click="toggleSidebar" id="toggle-btn">
          <i class="bi bi-chevron-double-left"></i>
        </button>
      </li>
      <li class="active">
        <a href="#">
          <i class="bi bi-house-door"></i>
          <span>Home</span>
        </a>
      </li>
      <li>
        <a href="#">
          <i class="bi bi-bar-chart"></i>
          <span>Dashboard</span>
        </a>
      </li>
      <li>
        <button @click="toggleSubMenu(0)" class="dropdown-btn" :class="{ rotate: openSubMenuIndex === 0 }">
          <i class="bi bi-plus-square"></i>
          <span>Create</span>
          <i class="bi bi-chevron-down"></i>
        </button>
        <ul class="sub-menu" :class="{ show: openSubMenuIndex === 0 }">
          <div>
            <li><a href="#">Folder</a></li>
            <li><a href="#">Document</a></li>
            <li><a href="#">Project</a></li>
          </div>
        </ul>
      </li>
      <li>
        <button @click="toggleSubMenu(1)" class="dropdown-btn" :class="{ rotate: openSubMenuIndex === 1 }">
          <i class="bi bi-list-check"></i>
          <span>Todo-Lists</span>
          <i class="bi bi-chevron-down"></i>
        </button>
        <ul class="sub-menu" :class="{ show: openSubMenuIndex === 1 }">
          <div>
            <li><a href="#">Work</a></li>
            <li><a href="#">Private</a></li>
            <li><a href="#">Coding</a></li>
            <li><a href="#">Gardening</a></li>
            <li><a href="#">School</a></li>
          </div>
        </ul>
      </li>
      <li>
        <a href="#">
          <i class="bi bi-calendar-event"></i>
          <span>Calendar</span>
        </a>
      </li>
      <li>
        <a href="#">
          <i class="bi bi-person"></i>
          <span>Profile</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isSidebarClosed = ref(false)
const openSubMenuIndex = ref(null)

function toggleSidebar() {
  isSidebarClosed.value = !isSidebarClosed.value
  openSubMenuIndex.value = null // Đóng tất cả submenu khi thu gọn sidebar
}

function toggleSubMenu(idx) {
  if (openSubMenuIndex.value === idx) {
    openSubMenuIndex.value = null
  } else {
    openSubMenuIndex.value = idx
    isSidebarClosed.value = false // Mở sidebar nếu đang đóng
  }
}
</script>

<style scoped>
#sidebar{
  box-sizing: border-box;
  height: 100vh;
  width: 250px;
  padding: 5px 0;
  background-color: white;
  border-right: 1px solid #e0e0e0 ;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.1);

  position: sticky;
  top: 0;
  align-self: start;
  transition: 300ms ease-in-out;
  overflow: hidden;
  text-wrap: nowrap;
}
#sidebar.close{
  padding: 5px 0;
  width: 50px !important;
  min-width: 50px !important;
  /* max-width: 50px !important; */
  /* padding: 0 !important; */
}


#sidebar ul{
  list-style: none;
}
#sidebar > ul > li:first-child{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  .logo{
    font-weight: 600;
  }
}
#sidebar ul li.active a{
  color: var(--accent-clr);

  svg{
    fill: var(--accent-clr);
  }
}

#sidebar a, #sidebar .dropdown-btn, #sidebar .logo{
  border-radius: .5em;
  padding: .85em;
  text-decoration: none;
  color: var(--text-clr);
  display: flex;
  align-items: center;
  gap: 1em;
}
.dropdown-btn{
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
}
#sidebar svg{
  flex-shrink: 0;
  fill: var(--text-clr);
}
#sidebar a span, #sidebar .dropdown-btn span{
  flex-grow: 1;
}
#sidebar a:hover, #sidebar .dropdown-btn:hover{
  background-color: #f0f0f0;
}
#sidebar .sub-menu{
  display: grid;
  grid-template-rows: 0fr;
  transition: 300ms ease-in-out;

  > div{
    overflow: hidden;
  }
}
#sidebar .sub-menu.show{
  grid-template-rows: 1fr;
}
.dropdown-btn svg{
  transition: 200ms ease;
}
.rotate svg:last-child{
  rotate: 180deg;
}
#sidebar .sub-menu a{
  padding-left: 2em;
}
#toggle-btn{
  margin-left: auto;
  padding: 1em;
  border: none;
  border-radius: .5em;
  background: none;
  cursor: pointer;

  svg{
    transition: rotate 150ms ease;
  }
}
#toggle-btn:hover{
  background-color: var(--hover-clr);
}
 ul{
    padding-left: 5px;
}
</style>