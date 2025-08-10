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
      <span class="mx-2 d-inline-flex align-items-center">
        Trang
        <template v-if="canJump">
          <input
            type="number"
            class="form-control form-control-sm page-input ms-1"
            v-model.number="inputPage"
            :min="1"
            :max="totalPages"
            @keyup.enter="emitJump"
            @blur="onBlur"
            style="width: 72px; text-align: center;"
          />
        </template>
        <template v-else>
          <span class="mx-1">{{ pageNumber + 1 }}</span>
        </template>
        <span class="ms-1">/ {{ totalPages }}</span>
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
import { ref, watch, computed, getCurrentInstance } from 'vue'

const props = defineProps({
  pageNumber: Number,
  totalPages: Number,
  isLastPage: Boolean,
  pageSize: Number,
  itemsPerPageOptions: Array,
  totalElements: Number,
})

const emit = defineEmits(['prev', 'next', 'update:pageSize', 'goToPage'])

// Phát hiện listener @goToPage từ vnode.props (đáng tin cậy hơn $attrs khi có defineEmits)
const instance = getCurrentInstance()
const canJump = computed(() => {
  const vp = instance?.vnode?.props || {}
  return Boolean(vp.onGoToPage || vp['onGoToPage'] || vp['onGo-to-page'])
})

const inputPage = ref(1)

watch(
  () => props.pageNumber,
  (newPage) => {
    inputPage.value = (Number(newPage) || 0) + 1
  },
  { immediate: true }
)

function emitJump() {
  if (!canJump.value) return
  let target = Number(inputPage.value)
  if (!Number.isFinite(target)) return
  if (props.totalPages && props.totalPages > 0) {
    if (target < 1) target = 1
    if (target > props.totalPages) target = props.totalPages
  } else {
    target = 1
  }
  inputPage.value = target
  emit('goToPage', target - 1)
}

function onBlur() {
  emitJump()
}
</script>

<style scoped>

 .btn-primary {
  background: linear-gradient(135deg, #4f3a6d 0%, #3b3157 100%) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.527) !important;
}

</style>