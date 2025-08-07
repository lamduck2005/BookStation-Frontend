<template>
  <div>
    <h3>Top sách bán chạy</h3>
    <table>
      <thead>
        <tr>
          <th>Sách</th>
          <th>Số lượng bán</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.name">
          <td>{{ book.name }}</td>
          <td>{{ book.sold }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTopBookSold } from "@/services/admin/dashboard";

const books = ref([]);

onMounted(async () => {
  const res = await getTopBookSold(5);
  books.value = res.map((item) => ({
    name: item.bookName,
    sold: item.soldQuantity,
  }));
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 6px #e3e8ee;
}
th {
  background: #f0f4fa;
  font-weight: 600;
  color: #333;
}
th,
td {
  padding: 12px 8px;
  border-bottom: 1px solid #f0f4fa;
  text-align: left;
}
tr:hover {
  background: #f7fafd;
  transition: background 0.2s;
}
</style>
