<template>
  <div class="container mt-4">
    <button>+</button>
    <h3 class="mb-3">Danh sách tác giả</h3>
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Tên tác giả</th>
          <th>Tiểu sử</th>
          <th>Ngày sinh</th>
          <th>Ngày tạo</th>
          <th>Ngày cập nhật</th>
          <th>Người tạo</th>
          <th>Người cập nhật</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="author in authors" :key="author.id">
          <td>{{ author.id }}</td>
          <td>{{ author.authorName }}</td>
          <td style="max-width:200px; white-space:pre-line;">{{ author.biography }}</td>
          <td>{{ author.birthDate }}</td>
          <td>{{ author.createdAt }}</td>
          <td>{{ author.updatedAt }}</td>
          <td>{{ author.createdBy }}</td>
          <td>{{ author.updatedBy }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getAllAuthors } from '../store/author';

const authors = ref([]);

onMounted(async () => {
  authors.value = await getAllAuthors();
});
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
</style>
