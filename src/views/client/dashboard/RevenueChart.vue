<template>
  <div>
    <div class="chart-header">
      <span>Doanh thu theo tháng</span>
      <select v-model="filter">
        <option value="month">Tháng</option>
        <option value="week">Tuần</option>
        <option value="year">Năm</option>
      </select>
    </div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import { getRevenueStats } from "@/services/admin/dashboard";

const filter = ref("month");
const chart = ref(null);
let chartInstance = null;

const dataSets = ref({
  month: [],
  week: [],
  year: [],
});
const labelsSets = ref({
  month: [],
  week: [],
  year: [],
});

async function fetchRevenueData() {
  let type = filter.value;
  let year = new Date().getFullYear();
  let month = type === "week" ? new Date().getMonth() + 1 : undefined;
  const res = await getRevenueStats(type, year, month);
  console.log("Revenue data:", res);

  if (type === "month") {
    labelsSets.value.month = res.map((item) => "Th" + item.month);
    dataSets.value.month = res.map((item) => item.revenue);
  } else if (type === "week") {
    labelsSets.value.week = res.map((item) => "Tuần " + item.week);
    dataSets.value.week = res.map((item) => item.revenue);
  } else if (type === "year") {
    labelsSets.value.year = res.map((item) => item.year + "");
    dataSets.value.year = res.map((item) => item.revenue);
  }
}

function renderChart() {
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chart.value, {
    type: "line",
    data: {
      labels: labelsSets.value[filter.value],
      datasets: [
        {
          label: "Doanh thu (₫)",
          data: dataSets.value[filter.value],
          borderColor: "#42a5f5",
          backgroundColor: "rgba(66,165,245,0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#1976d2",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString();
            },
          },
        },
      },
    },
  });
}

const updateChart = async () => {
  await fetchRevenueData();
  renderChart();
};

onMounted(updateChart);
watch(filter, updateChart);
</script>

<style scoped>
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.chart-header select {
  padding: 6px 18px 6px 12px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  background: #f7fafd;
  font-size: 1rem;
  color: #1976d2;
  outline: none;
  transition: border 0.2s;
  cursor: pointer;
}
.chart-header select:focus {
  border-color: #1976d2;
  background: #e3f0ff;
}
</style>
