<template>
  <span 
    :class="finalStatusClass"
    :style="clickable ? 'cursor: pointer;' : ''"
    @click="handleClick"
  >
    {{ finalStatusText }}
  </span>
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
  },
  statusText: {
    type: String,
    default: ''
  },
  statusClass: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const finalStatusClass = computed(() => {
  // Nếu có statusClass tùy chỉnh thì dùng nó
  if (props.statusClass) {
    return props.statusClass;
  }
  // Ngược lại dùng logic cũ cho số
  return Number(props.status) === 1
    ? 'status-label-active'
    : 'status-label-inactive';
});

const finalStatusText = computed(() => {
  // Nếu có statusText tùy chỉnh thì dùng nó
  if (props.statusText) {
    return props.statusText;
  }
  // Ngược lại dùng logic cũ cho số
  return Number(props.status) === 1 ? props.activeText : props.inactiveText;
});

const handleClick = () => {
  if (props.clickable) {
    emit('toggle');
  }
};
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

/* Thêm CSS cho các trạng thái event string */
.status-draft {
  display: inline-block;
  background: #e2e3e5;
  color: #495057;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #d6d8db;
}

.status-published {
  display: inline-block;
  background: #d1ecf1;
  color: #0c5460;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #bee5eb;
}

.status-active {
  display: inline-block;
  background: #d4edda;
  color: #218838;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #c3e6cb;
}

.status-inactive {
  display: inline-block;
  background: #f8d7da;
  color: #721c24;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}

.status-cancelled {
  display: inline-block;
  background: #f8d7da;
  color: #721c24;
  font-weight: 500;
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 0.9rem;
  border: 1px solid #f5c6cb;
}
</style>
