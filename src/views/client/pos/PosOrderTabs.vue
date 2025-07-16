<template>
  <div class="order-tabs">
    <div
      v-for="(tab, idx) in tabs"
      :key="tab.id"
      class="order-tab"
      :class="{ active: idx === activeTab }"
      @click="activeTab = idx"
    >
      {{ tab.name }}
    </div>
    <button class="add-tab-btn" @click="handleAddTab">
      <i class="bi bi-plus"></i>
    </button>

    <!-- Popup thêm đơn hàng -->
    <div
      v-if="showPopup"
      class="popup-backdrop"
      @click.self="showPopup = false"
    >
      <div class="popup-content">
        <h3>Thêm đơn hàng mới</h3>
        <input v-model="newTabName" placeholder="Tên đơn hàng" />
        <div class="popup-actions">
          <button @click="addTab">Thêm</button>
          <button @click="showPopup = false">Hủy</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Hiển thị OrderPanel của tab đang active -->
  <div class="order-panels">
    <OrderPanel
      v-if="tabs[activeTab]"
      :order="tabs[activeTab]"
      :key="tabs[activeTab].id"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import OrderPanel from "./OrderPanel.vue";

// Nếu muốn bật/tắt popup, chỉ cần đổi biến này
const usePopup = true;

const tabs = ref([
  { id: 1, name: "Đơn hàng 1", canClose: false },
  { id: 2, name: "Đơn hàng 2", canClose: true },
  { id: 3, name: "Đơn hàng 3", canClose: true },
]);
const activeTab = ref(0);
const showPopup = ref(false);
const newTabName = ref("");

function handleAddTab() {
  if (usePopup) {
    showPopup.value = true;
  } else {
    addTab();
  }
}

function addTab() {
  let name = newTabName.value.trim();
  if (!name) {
    name = `Đơn hàng ${tabs.value.length + 1}`;
  }
  tabs.value.push({
    id: Date.now(),
    name,
    canClose: true,
  });
  activeTab.value = tabs.value.length - 1;
  newTabName.value = ""; // Reset input after adding
  showPopup.value = false; // Ensure popup closes
}

function removeTab(idx) {
  if (tabs.value[idx].canClose) {
    tabs.value.splice(idx, 1);
    if (activeTab.value >= tabs.value.length) {
      activeTab.value = Math.max(tabs.value.length - 1, 0);
    }
  }
}
</script>

<style scoped>
.order-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}
.order-tab {
  background: #e5e7eb;
  padding: 8px 18px;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  position: relative;
  font-weight: 500;
  color: #222;
  display: flex;
  align-items: center;
  min-width: 110px;
}
.order-tab.active {
  background: #00bfae;
  color: #fff;
}
.close-btn {
  color: #ff4d4f;
  margin-left: 8px;
  font-size: 16px;
  cursor: pointer;
}
.add-tab-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  font-size: 20px;
  cursor: pointer;
  margin-left: 8px;
}
.popup-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-content {
  background: #fff;
  border-radius: 10px;
  padding: 24px 32px;
  min-width: 320px;
  box-shadow: 0 4px 24px #0001;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.popup-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.popup-content input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
}
.popup-content button {
  padding: 6px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.popup-content button:first-child {
  background: #00bfae;
  color: #fff;
}
.popup-content button:last-child {
  background: #e5e7eb;
}
</style>