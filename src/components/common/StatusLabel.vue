<template>
  <span :class="statusClass">{{ statusText }}</span>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  status: {
    type: [Number, String, Boolean],
    default: 1
  },
  activeText: {
    type: String,
    default: 'Hoạt động'
  },
  inactiveText: {
    type: String,
    default: 'Không hoạt động'
  }
});

const statusClass = computed(() =>
  Number(props.status) === 1
    ? 'status-label-active'
    : 'status-label-inactive'
);
const statusText = computed(() =>
  Number(props.status) === 1 ? props.activeText : props.inactiveText
);
</script>

<style scoped>
.status-label-active {
  display: inline-block;
  background: #d4edda;
  color: #218838;
  font-weight: 400;
  border-radius: 6px;
  padding: 1px 8px;
  font-size: 0.88rem;
  border: 1px solid #c3e6cb;
  vertical-align: middle;
  margin-left: 0;
  margin-right: 0;
  box-shadow: none;
  letter-spacing: 0.1px;
  font-family: inherit;
}
.status-label-inactive {
  display: inline-block;
  background: #f8d7da;
  color: #b71c1c;
  font-weight: 400;
  border-radius: 6px;
  padding: 1px 8px;
  font-size: 0.88rem;
  border: 1px solid #f5c6cb;
  vertical-align: middle;
  margin-left: 0;
  margin-right: 0;
  box-shadow: none;
  letter-spacing: 0.1px;
  font-family: inherit;
}
</style>
