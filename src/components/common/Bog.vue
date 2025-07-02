<template>
  <div class="row">
    <div class="col-3 sidebar">
      <SidebarBog />
    </div>
    <div class="col-7">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SidebarBog from "./bog/SidebarBog.vue";
import { RouterView } from "vue-router";

export default {
  name: "Bog",
  components: {
    SidebarBog,
    RouterView,
  },
};
</script>

<style scoped>
body {
  background-color: #e3f2fd;
  font-family: Arial, sans-serif;
}

.header {
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.sidebar {
  margin: 0px 10px 0px 30px;
}
body {
  margin: 0px;
}
.row {
  width: 100%;
}
</style>
