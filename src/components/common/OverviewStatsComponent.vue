<template>
    <div class="overview-stats">
      <div class="stat-card" v-for="stat in props.stats" :key="stat.label">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    stats: {
      type: Array,
      default: () => [],
      validator: (arr) =>
        Array.isArray(arr) &&
        arr.every(
          (item) =>
            item &&
            Object.prototype.hasOwnProperty.call(item, "label") &&
            Object.prototype.hasOwnProperty.call(item, "value")
        ),
    },
  });
  </script>
  
  <style scoped>
  .overview-stats {
    margin-bottom: 30px;
    display: flex;
    gap: 32px;
  }
  .stat-card {
    flex: 1;
    background: linear-gradient(135deg, #e3f0ff 0%, #f7fafd 100%);
    border-radius: 12px;
    padding: 20px 0;
    box-shadow: 0 2px 12px #e3e8ee;
    text-align: center;
    transition: box-shadow 0.2s;
  }
  .stat-card:hover {
    box-shadow: 0 4px 24px #d0e2ff;
  }
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #1976d2;
  }
  .stat-label {
    color: #888;
    margin-top: 12px;
    font-size: 1rem;
  }
  </style>
  