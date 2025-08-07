<template>
  <div class="inventory-card">
    <h3>Tình trạng tồn kho</h3>
    <table>
      <thead>
        <tr>
          <th>Sách</th>
          <th>Tồn kho</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.name">
          <td>{{ book.name }}</td>
          <td>{{ book.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllBookStock } from "@/services/admin/dashboard";

const books = ref([]);

onMounted(async () => {
  const res = await getAllBookStock();
  books.value = res.map((item) => ({
    name: item.bookName,
    stock: item.stockQuantity,
  }));
});
</script>

<style scoped>
.inventory-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #e3e8ee;
  padding: 24px;
  margin-top: 32px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
th {
  background: #f0f4fa;
  font-weight: 600;
  color: #333;
}
tr:hover {
  background: #f7fafd;
  transition: background 0.2s;
}
</style>
