<template>
  <div class="top-users-container">
    <div class="header-section">
      <div class="icon-title">
        <i class="bi bi-graph-up chart-icon"></i>
        <h3>Top người dùng chi tiêu cao</h3>
      </div>
    </div>

    <div class="table-container">
      <table class="top-users-table">
        <thead>
          <tr>
            <th class="rank-header">STT</th>
            <th class="user-header">Người dùng</th>
            <th class="spent-header">Chi tiêu</th>
            <!-- <th class="medal-header">Hạng</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.name" class="user-row">
            <td class="rank-cell">
              <div class="rank-number" :class="getRankClass(index)">
                {{ user.rank }}
              </div>
            </td>
            <td class="user-info">
              <div class="user-name">{{ user.name }}</div>
            </td>
            <td class="spent-cell">
              <div class="spent-amount">{{ user.spent }} ₫</div>
              <div class="spent-label">chi tiêu</div>
            </td>
            <!-- <td class="medal-cell">
              <i class="medal-icon">{{ getMedalIcon(user.rankName) }}</i>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
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
    rankName: item.rankName,
  }));
});

const getRankClass = (index) => {
  if (index === 0) return "rank-1";
  if (index === 1) return "rank-2";
  if (index === 2) return "rank-3";
  return "rank-other";
};

// Function để get medal icon dựa trên rankName
const getMedalIcon = (rankName) => {
  if (!rankName) return "🏅";

  const lowerRank = rankName.toLowerCase();

  if (
    lowerRank.includes("vàng") ||
    lowerRank.includes("gold") ||
    lowerRank.includes("kim")
  ) {
    return "🥇"; // Huy chương vàng
  } else if (lowerRank.includes("bạc") || lowerRank.includes("silver")) {
    return "🥈"; // Huy chương bạc
  } else if (
    lowerRank.includes("đồng") ||
    lowerRank.includes("bronze") ||
    lowerRank.includes("dong")
  ) {
    return "🥉"; // Huy chương đồng
  } else if (lowerRank.includes("kim cương") || lowerRank.includes("diamond")) {
    return "💎"; // Kim cương
  } else if (lowerRank.includes("bạch kim") || lowerRank.includes("platinum")) {
    return "🏆"; // Platinum trophy
  } else {
    return "🏅"; // Default medal icon
  }
};
</script>

<style scoped>
.top-users-container {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.top-users-container:hover {
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

.header-section {
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff;
  border-bottom: none;
  border-radius: 15px 15px 0 0;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-icon {
  font-size: 20px;
  color: #ffffff;
  transform: none; /* Đảm bảo không bị nghiêng */
}

.icon-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

.top-users-table {
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.top-users-table thead {
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
}

.top-users-table th {
  padding: 16px 24px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #667eea;
  background: #ffffff;
}

.rank-header {
  width: 80px;
  text-align: center !important;
}

.user-header {
  width: 45%;
}

.spent-header {
  width: 35%;
  text-align: right !important;
}

.medal-header {
  width: 80px;
  text-align: center !important;
}

.user-row {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.user-row:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-left-color: #667eea;
  transform: translateX(2px);
}

.user-row td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.user-row:last-child td {
  border-bottom: none;
}

.rank-cell {
  width: 80px;
  text-align: center;
}

.rank-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.user-row:hover .rank-number {
  transform: scale(1.1);
}

.rank-number.rank-1 {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}

.rank-number.rank-2 {
  background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
}

.rank-number.rank-3 {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  box-shadow: 0 4px 12px rgba(142, 68, 173, 0.3);
}

.rank-number.rank-other {
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  box-shadow: 0 2px 8px rgba(52, 73, 94, 0.3);
}

.user-info {
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.user-row:hover .user-name {
  color: #e67e22;
  font-weight: 800;
}

.user-detail {
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.2;
  font-weight: 600;
}

.spent-cell {
  text-align: right;
  white-space: nowrap;
}

.spent-amount {
  font-size: 15px;
  font-weight: 800;
  color: #27ae60;
  line-height: 1.2;
  margin-bottom: 2px;
  transition: all 0.3s ease;
  font-variant-numeric: tabular-nums;
}

.user-row:hover .spent-amount {
  color: #229954;
  transform: scale(1.05);
}

.spent-label {
  font-size: 11px;
  color: #95a5a6;
  line-height: 1;
  font-weight: 600;
}

.medal-cell {
  text-align: center;
}

.medal-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
  transform: none;
  display: inline-block;
}

.user-row:hover .medal-icon {
  transform: scale(1.2) rotate(10deg);
}

/* Responsive */
@media (max-width: 768px) {
  .header-section {
    padding: 16px 20px 12px;
  }

  .icon-title h3 {
    font-size: 15px;
  }

  .chart-icon {
    font-size: 18px;
  }

  .user-item {
    padding: 10px 16px;
  }

  .user-name {
    font-size: 13px;
  }

  .user-detail {
    font-size: 11px;
  }

  .medal-icon {
    font-size: 16px;
  }
}

/* Custom scrollbar với màu tím */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
