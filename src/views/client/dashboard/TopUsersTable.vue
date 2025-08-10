<template>
  <div>
    <h3>Top người dùng chi tiêu cao</h3>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Người dùng</th>
          <th>Chi tiêu (₫)</th>
          <th>Hạng thành viên</th>
          <!-- Thêm cột này -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.name">
          <td>{{ user.rank }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.spent }}</td>
          <td>{{ user.rankName }}</td>
          <!-- Thêm dòng này -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTopSpenders } from "@/services/admin/dashboard";
const users = ref([]);
onMounted(async () => {
  const res = await getTopSpenders(5);
  users.value = res.map((item, idx) => ({
    rank: idx + 1,
    name: item.fullName,
    spent: item.totalSpent.toLocaleString(),
    rankName: item.rankName, // Thêm trường này
  }));
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}
</style>
