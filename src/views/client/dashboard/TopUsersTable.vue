<template>
  <div class="top-users-container">
    <div class="header-section">
      <div class="icon-title">
        <i class="bi bi-graph-up chart-icon"></i>
        <h3>Top người dùng chi tiêu cao</h3>
      </div>
    </div>

    <div class="users-list">
      <div v-for="(user, index) in users" :key="user.name" class="user-item">
        <div class="user-rank">
          <div class="rank-number" :class="getRankClass(index)">
            {{ user.rank }}
          </div>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-detail">{{ user.spent }} ₫</div>
        </div>
        <div class="trend-icon">
          <i class="medal-icon">{{ getMedalIcon(user.rankName) }}</i>
        </div>
      </div>
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

.users-list {
  padding: 8px 0;
  max-height: 320px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f8fafc;
  border-left: 3px solid transparent;
  position: relative;
}

.user-item:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-left-color: #667eea;
  transform: translateX(2px);
}

.user-item:last-child {
  border-bottom: none;
}

.user-rank {
  width: 36px;
  margin-right: 16px;
}

.rank-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
}

.user-item:hover .rank-number {
  transform: scale(1.1);
}

.rank-number.rank-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.rank-number.rank-2 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.rank-number.rank-3 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.rank-number.rank-other {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3px;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.user-item:hover .user-name {
  color: #667eea;
}

.user-detail {
  font-size: 12px;
  color: #667eea;
  line-height: 1.2;
  font-weight: 600;
}

.trend-icon {
  margin-left: 12px;
  opacity: 1;
}

.medal-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
  transform: none; /* Đảm bảo không bị nghiêng */
}

.user-item:hover .medal-icon {
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
</style>
