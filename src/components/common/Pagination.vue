<template>
  <div class="d-flex justify-content-end align-items-center mt-3 pagination-controls">
    <div class="me-3">
      <button
        class="btn btn-sm"
        :class="pageNumber === 0 ? 'btn-light' : 'btn-primary'"
        @click="$emit('prev')"
        :disabled="pageNumber === 0"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="mx-2">
        Trang {{ pageNumber + 1 }} / {{ totalPages }}
      </span>
      <button
        class="btn btn-sm"
        :class="isLastPage ? 'btn-light' : 'btn-primary'"
        @click="$emit('next')"
        :disabled="isLastPage"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <div>
      <select
        class="form-select form-select-sm items-per-page-actual-select"
        :value="pageSize"
        @change="$emit('update:pageSize', Number($event.target.value))"
        aria-label="Items per page"
      >
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
          {{ option }} / trang
        </option>
      </select>
    </div>
    <div class="ms-3">
      Tổng: {{ totalElements }} bản ghi
    </div>
  </div>
</template>

<script setup>
defineProps({
  pageNumber: Number,
  totalPages: Number,
  isLastPage: Boolean,
  pageSize: Number,
  itemsPerPageOptions: Array,
  totalElements: Number,
});
</script>
