<template>
  <div>
    <div class="chart-header">
      <span>Doanh thu theo tháng</span>

      <div class="actions">
        <select v-model="filter">
          <option value="month">Tháng</option>
          <option value="week">Tuần</option>
          <option value="year">Năm</option>
        </select>
        <button class="btn-custom" @click="toggleCustom">Tùy chỉnh</button>
      </div>
    </div>

    <!-- Panel tùy chỉnh -->
    <div v-if="showCustom" class="custom-panel">
      <div class="row">
        <div class="col">
          <label>Bắt đầu</label>
          <input type="date" v-model="startDate" @change="onDateRangeChange" />
        </div>
        <div class="col">
          <label>Kết thúc</label>
          <input type="date" v-model="endDate" @change="onDateRangeChange" />
        </div>
        <div class="col">
          <label>Nhóm theo</label>
          <select v-model="groupBy">
            <option v-for="opt in allowedGroupBys" :key="opt" :value="opt">
              {{ labelMap[opt] }}
            </option>
          </select>
        </div>
      </div>

      <div class="panel-actions">
        <button class="btn-apply" @click="applyCustom">Áp dụng</button>
        <button class="btn-cancel" @click="cancelCustom">Hủy</button>
      </div>
      <small class="hint">
        Khoảng: {{ diffDays }} ngày • Gợi ý:
        {{ allowedGroupBys.map((o) => labelMap[o]).join(", ") }}
      </small>
    </div>

    <canvas ref="chart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Chart from "chart.js/auto";
import { getRevenueStats } from "@/services/admin/dashboard";

const filter = ref("month"); // preset: month/week/year
const chart = ref(null);
let chartInstance = null;

// Dữ liệu preset
const dataSets = ref({ month: [], week: [], year: [], custom: [] });
const labelsSets = ref({ month: [], week: [], year: [], custom: [] });

// UI tùy chỉnh
const showCustom = ref(false);
const useCustom = ref(false); // true khi đã bấm Áp dụng
const todayStr = () => new Date().toISOString().slice(0, 10);

// Khởi tạo ngày mặc định
const getDefaultStartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
};

const getDefaultEndDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const startDate = ref(getDefaultStartDate());
const endDate = ref(getDefaultEndDate());
const groupBy = ref("day");
const labelMap = { day: "Ngày", week: "Tuần", month: "Tháng", year: "Năm" };

// Tính số ngày và gợi ý đơn vị nhóm phù hợp
const diffDays = computed(() => {
  const s = new Date(startDate.value);
  const e = new Date(endDate.value);
  const ms = e - s;
  return ms >= 0 ? Math.floor(ms / (1000 * 60 * 60 * 24)) + 1 : 0;
});

const allowedGroupBys = ref(["day", "week"]);
const recomputeAllowedGroupBys = () => {
  const d = diffDays.value;
  let opts = [];
  if (d <= 0) opts = ["day"];
  else if (d <= 31) opts = ["day", "week"];
  else if (d <= 180) opts = ["week", "month"];
  else if (d <= 365) opts = ["month"];
  else opts = ["month", "year"];
  allowedGroupBys.value = opts;
  if (!opts.includes(groupBy.value)) groupBy.value = opts[0];
};

const onDateRangeChange = () => recomputeAllowedGroupBys();

const toggleCustom = () => {
  showCustom.value = !showCustom.value;
  if (showCustom.value) {
    recomputeAllowedGroupBys();
  }
};

const applyCustom = async () => {
  if (!startDate.value || !endDate.value) return;
  if (new Date(startDate.value) > new Date(endDate.value)) return;
  useCustom.value = true;
  await updateChart();
  showCustom.value = false;
};

const cancelCustom = () => {
  showCustom.value = false;
  useCustom.value = false;
};

// Helpers map nhãn theo kiểu trả về (sửa lại)
const formatDateLabel = (item) => {
  if (item.day) {
    const parts = item.day.split("-"); // ["2025", "08", "01"]
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // "01/08/2025"
    }
  }

  if (item.date) {
    const parts = item.date.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  // Fallback các trường khác
  if (item.month && item.year) return `Th${item.month}`;
  if (item.week && item.year) return `T${item.week}`;
  if (item.year) return String(item.year);

  return item.label ?? "";
};

async function fetchRevenueData() {
  if (useCustom.value) {
    const res = await getRevenueStats({
      startDate: startDate.value,
      endDate: endDate.value,
      groupBy: groupBy.value,
    });

    console.log("Raw response:", res); // Debug

    const labels = res.map((i) => {
      let label = "";
      if (groupBy.value === "day") label = formatDateLabel(i);
      else if (groupBy.value === "week") label = `T${i.week ?? i.label ?? ""}`;
      else if (groupBy.value === "month")
        label = `Th${i.month ?? i.label ?? ""}`;
      else label = String(i.year ?? i.label ?? "");

      console.log("Item:", i, "-> Label:", label); // Debug
      return label;
    });

    console.log("Final labels:", labels); // Debug

    const data = res.map((i) => i.revenue ?? i.total ?? 0);

    labelsSets.value.custom = labels;
    dataSets.value.custom = data;
    return;
  }

  // Preset cũ
  const type = filter.value;
  const year = new Date().getFullYear();
  const month = type === "week" ? new Date().getMonth() + 1 : undefined;
  const res = await getRevenueStats(type, year, month);

  if (type === "month") {
    labelsSets.value.month = res.map((item) => `Th${item.month}`);
    dataSets.value.month = res.map((item) => item.revenue);
  } else if (type === "week") {
    labelsSets.value.week = res.map((item) => `T${item.week}`);
    dataSets.value.week = res.map((item) => item.revenue);
  } else if (type === "year") {
    labelsSets.value.year = res.map((item) => String(item.year));
    dataSets.value.year = res.map((item) => item.revenue);
  }
}

function renderChart() {
  const modeKey = useCustom.value ? "custom" : filter.value;
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chart.value, {
    type: "line",
    data: {
      labels: labelsSets.value[modeKey],
      datasets: [
        {
          label: "Doanh thu (₫)",
          data: dataSets.value[modeKey],
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
      plugins: { legend: { display: true } },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 12, // Giới hạn số labels hiển thị
            maxRotation: 45, // Xoay labels nếu dài
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              try {
                return Number(value).toLocaleString("vi-VN");
              } catch {
                return value;
              }
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              // Hiển thị tooltip với format đẹp hơn
              const index = tooltipItems[0].dataIndex;
              const modeKey = useCustom.value ? "custom" : filter.value;
              return labelsSets.value[modeKey][index];
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

onMounted(() => {
  recomputeAllowedGroupBys();
  updateChart();
});
watch(filter, async () => {
  useCustom.value = false; // chuyển preset -> bỏ custom
  await updateChart();
});
</script>

<style scoped>
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.actions {
  display: flex;
  gap: 8px;
  align-items: center;
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
.btn-custom {
  padding: 6px 12px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.custom-panel {
  border: 1px solid #e0e7ef;
  background: #f7fafd;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0 12px;
}
.custom-panel .row {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 12px;
}
.custom-panel .col label {
  display: block;
  font-size: 0.85rem;
  color: #546e7a;
  margin-bottom: 4px;
}
.custom-panel input[type="date"],
.custom-panel select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  background: #fff;
}
.panel-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}
.btn-apply {
  padding: 6px 12px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
}
.btn-cancel {
  padding: 6px 12px;
  background: #b0bec5;
  color: #263238;
  border: none;
  border-radius: 6px;
}
.hint {
  display: block;
  margin-top: 6px;
  color: #607d8b;
}
</style>
