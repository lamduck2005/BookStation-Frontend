<template>
  <div class="category-client">
    <div class="category-header">
      <!-- Thay dòng dưới -->
      <!-- <i class="bi bi-grid-3x3-gap-fill"></i> -->
      <!-- bằng SVG trên -->
      <svg width="24" height="24" viewBox="0 0 24 24" style="margin-right: 4px">
        <rect
          x="2"
          y="2"
          width="7"
          height="7"
          rx="2"
          stroke="#d7263d"
          stroke-width="2"
          fill="none"
        />
        <circle
          cx="17.5"
          cy="5.5"
          r="3.5"
          stroke="#d7263d"
          stroke-width="2"
          fill="none"
        />
        <rect
          x="2"
          y="15"
          width="7"
          height="7"
          rx="2"
          stroke="#d7263d"
          stroke-width="2"
          fill="none"
        />
        <rect
          x="15"
          y="15"
          width="7"
          height="7"
          rx="2"
          stroke="#d7263d"
          stroke-width="2"
          fill="none"
        />
      </svg>
      <span>Danh mục sản phẩm</span>
    </div>
    <div class="category-list">
      <div
        class="category-item"
        v-for="c in categories"
        :key="c.id"
        @click="goToCategory(c.id, 'parent')"
        style="cursor: pointer"
      >
        <img class="category-thumb" :src="c.imageUrl" :alt="c.categoryName" />
        <div class="category-name">{{ c.categoryName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getAllCategoriesByParentId,
  getAllCategoriesParentNotNull,
  getAllCategoriesParentNull,
} from "@/services/admin/category";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const categories = ref([]);
const router = useRouter();

onMounted(async () => {
  categories.value = await getAllCategoriesParentNull();
});

function goToCategory(id, type) {
  const query = {};
  if (type === "parent") {
    query.mainCategory = btoa(id.toString());
  }
  // Nếu có loại "child", bạn có thể bổ sung logic ở đây

  router.push({
    path: "/products",
    query: query,
  });
}
</script>

<style scoped>
.category-client {
  background: #fff;
  border-radius: 8px;
  padding: 18px 16px 12px 16px;
  box-shadow: 0 2px 8px #0000000a;
  margin-bottom: 24px;
}
.category-header {
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.category-header i {
  color: #d7263d; /* Đổi màu icon sang đỏ */
  font-size: 20px;
}
.category-header span {
  color: #111; /* Đổi màu chữ sang đen */
  font-weight: 600; /* Đậm */
}
.category-list {
  display: flex;
  gap: 28px;
  overflow-x: auto; /* Cho phép trượt ngang */
  flex-wrap: nowrap; /* Không xuống dòng */
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 0;
  scrollbar-width: thin; /* Firefox */
}
.category-list::-webkit-scrollbar {
  height: 8px;
}
.category-list::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 4px;
}
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 110px; /* Tăng từ 90px lên 110px */
  min-height: 200px; /* Tăng từ 170px lên 200px */
  cursor: pointer;
  transition: transform 0.15s;
  justify-content: flex-start;
}
.category-item:hover {
  transform: translateY(-4px) scale(1.04);
}
.category-thumb {
  width: 90px; /* Tăng từ 70px lên 90px */
  height: 110px; /* Tăng từ 90px lên 110px */
  object-fit: contain;
  border-radius: 8px; /* Có thể tăng nhẹ border-radius */
  background: #f6f6f6;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px #0001;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-name {
  font-size: 14px;
  text-align: center;
  margin-top: 2px;
  color: #d7263d;
  font-weight: 500;
  min-height: 36px;
  line-height: 1.2;
  word-break: break-word;
}
</style>
