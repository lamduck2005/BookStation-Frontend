<template>
  <div class="pos-customer-info">
    <!-- Chọn loại khách -->
    <template v-if="!selectedCustomer">
      <button
        class="customer-btn"
        :class="{ active: !showSearch }"
        @click="resetToGuest"
      >
        Khách lẻ
      </button>
      <button
        class="choose-customer-btn"
        :class="{ active: showSearch }"
        @click="
          showSearch = true;
          selectedCustomer = null;
        "
      >
        Chọn khách hàng (F4)
      </button>
    </template>

    <!-- Form nhập thông tin khách lẻ -->
    <div v-if="!showSearch && !selectedCustomer" class="guest-form">
      <input
        v-model="guestName"
        class="guest-input"
        placeholder="Nhập họ và tên khách lẻ"
      />
      <input
        v-model="guestPhone"
        class="guest-input"
        placeholder="Nhập số điện thoại khách lẻ"
      />
      <button class="save-btn" @click="saveGuest">Lưu</button>
    </div>

    Hiển thị khách lẻ đã lưu hoặc khách đã chọn
    <div v-if="selectedCustomer" class="selected-customer">
      <div class="customer-info">
        <div class="customer-avatar">
          <template v-if="selectedCustomer.isGuest">
            <i class="bi bi-person"></i>
          </template>
          <template v-else>
            {{ getInitials(selectedCustomer.name) }}
          </template>
        </div>
        <div>
          <div class="customer-name">{{ selectedCustomer.name }}</div>
          <div class="customer-phone">{{ selectedCustomer.phone }}</div>
        </div>
        <button class="remove-btn" @click="resetToGuest">
          <i class="bi bi-x-circle-fill"></i>
        </button>
      </div>
      <hr />
    </div>

    <!-- Tìm kiếm khách hàng -->
    <div v-if="showSearch && !selectedCustomer" class="customer-search-box">
      <div class="search-input-wrap">
        <input
          v-model="search"
          class="customer-search-input"
          placeholder="Nhập số điện thoại/Tên khách hàng"
          @focus="fetchUsers"
        />
        <button class="search-btn">
          <i class="bi bi-search"></i>
        </button>
      </div>
      <div class="customer-list">
        <div
          class="customer-item"
          v-for="c in users"
          :key="c.id"
          @click="selectCustomer(c)"
        >
          <div class="customer-avatar">{{ getInitials(c.fullName) }}</div>
          <div>
            <div class="customer-name">{{ c.fullName }}</div>
            <div class="customer-phone">{{ c.phoneNumber }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userpos } from "@/services/admin/user";
import { ref, computed, onMounted, watch } from "vue";

const showSearch = ref(false);
const search = ref("");
const guestName = ref("");
const guestPhone = ref("");
const selectedCustomer = ref(null);
const users = ref([]);

// Gọi API mỗi khi search thay đổi
watch(search, () => {
  fetchUsers();
});

// Khi mở trang, có thể fetch mặc định nếu muốn
onMounted(() => {
  fetchUsers();
});
const fetchUsers = async () => {
  console.log("Fetching users with search:", search.value);
  const response = await userpos(search.value);
  users.value = response.data.data;

  console.log(users.value);
};

// Sử dụng users cho danh sách khách hàng
const filteredCustomers = computed(() => users.value);

function getInitials(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function saveGuest() {
  if (!guestName.value.trim() || !guestPhone.value.trim()) return;
  selectedCustomer.value = {
    name: guestName.value,
    phone: guestPhone.value,
    isGuest: true,
  };
  showSearch.value = false;
}

function selectCustomer(c) {
  selectedCustomer.value = {
    name: c.fullName, // Đảm bảo có trường name
    phone: c.phoneNumber,
    isGuest: false,
    ...c,
  };
  showSearch.value = false;
}

function resetToGuest() {
  showSearch.value = false;
  selectedCustomer.value = null;
  guestName.value = "";
  guestPhone.value = "";
}
</script>

<style scoped>
.pos-customer-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.customer-btn,
.choose-customer-btn {
  background: #e5e7eb;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 8px;
  transition: background 0.2s, color 0.2s;
}
.customer-btn.active,
.choose-customer-btn.active {
  background: #00bfae;
  color: #fff;
}
.customer-btn:disabled,
.choose-customer-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.guest-form {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.guest-input {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  font-size: 15px;
  outline: none;
}
.save-btn {
  background: #00bfae;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 2px;
  align-self: flex-end;
  font-size: 14px;
  min-width: 56px;
  height: 28px;
}
.selected-customer {
  margin-top: 12px;
}
.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}
.customer-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #e5f8f6;
  color: #00bfae;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 22px;
}
.customer-info .customer-avatar i {
  font-size: 26px;
  color: #00bfae;
}
.customer-name {
  font-weight: 600;
  font-size: 17px;
}
.customer-phone {
  font-size: 14px;
  color: #888;
}
.remove-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 22px;
  cursor: pointer;
  margin-left: auto;
  margin-right: 4px;
  margin-top: -8px;
}
hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 10px 0 0 0;
}
.customer-search-box {
  margin-top: 8px;
  width: 100%;
}
.search-input-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 4px 8px;
  margin-bottom: 8px;
}
.customer-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  padding: 6px 0;
  background: transparent;
}
.search-btn {
  background: none;
  border: none;
  color: #00bfae;
  font-size: 20px;
  cursor: pointer;
}
.customer-list {
  max-height: 180px;
  overflow-y: auto;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 2px 8px #e5e7eb33;
}
.customer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.customer-item:hover {
  background: #e6f7f4;
}
</style>
