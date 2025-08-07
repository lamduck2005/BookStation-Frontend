<template>
  <div>
    <div class="chart-header">
      <span>Số sách bán theo tháng</span>
    </div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import { getMonthlySoldQuantity } from "@/services/admin/dashboard";

const chart = ref(null);

onMounted(async () => {
  const res = await getMonthlySoldQuantity();
  console.log("Monthly sold quantity data:", res);
  const labels = res.map((item) => "Th" + item.month);
  const data = res.map((item) => item.revenue);

  new Chart(chart.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Sách bán",
          data,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return "#e0e0e0";
            // Tạo màu xám cho tất cả, màu xanh khi hover
            if (context.active) {
              return "#43a047";
            }
            return "#e0e0e0";
          },
          borderRadius: 16,
          hoverBackgroundColor: "#43a047",
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#222",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#888", font: { size: 16 } },
        },
        y: {
          grid: { color: "#f0f0f0" },
          ticks: { color: "#888", font: { size: 14 } },
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

<style scoped>
.chart-header {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1976d2;
}
</style>
