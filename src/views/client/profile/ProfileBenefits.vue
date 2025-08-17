<template>
  <div class="profile-benefits">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <h2 class="page-title">Ưu đãi thành viên</h2>
    </div>

    <!-- Member Benefits Content -->
    <div class="benefits-content">
      <!-- Current Member Status -->
      <div class="member-status-card mb-4">
        <div class="d-flex align-items-center">
          <div class="member-avatar me-3">
            <div class="crown-icon">
              <!-- Avatar Icon -->
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  fill="#F4F6F8"
                  stroke="#D1D5DB"
                  stroke-width="2"
                />
                <path d="M28 16L32 28H24L28 16Z" fill="#B0B6BE" />
                <circle cx="28" cy="36" r="6" fill="#B0B6BE" />
              </svg>
            </div>
          </div>
          <div class="member-info">
            <h4 class="member-name">{{ user.full_name }}</h4>
            <span class="member-rank" :class="rankClass">
              Thành viên {{ userRank.rank.rankName || "Không xác định" }}
            </span>
            <div class="member-points">
              B-Point tích lũy {{ user.total_point || 0 }}
            </div>
          </div>
        </div>
      </div> 

      <!-- Benefits Summary -->
      <div class="benefits-summary mt-5">
        <div class="row">
          <div class="col-md-4">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-gift text-primary"></i>
              </div>
              <h5>Quà tặng sinh nhật</h5>
              <p>Nhận quà tặng đặc biệt vào ngày sinh nhật của bạn</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-truck text-success"></i>
              </div>
              <h5>Ưu đãi freeship và mã giảm giá</h5>
              <p>Được ưu tiên nhận các mã freeship và giảm giá độc quyền</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="bi bi-percent text-warning"></i>
              </div>
              <h5>Tỉ lệ tích lũy B-Point trên giá trị đơn hàng</h5>
              <p>Tích lũy điểm thưởng với tỷ lệ hấp dẫn: 0,5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { fetchUserDetail, getUserRank } from "@/services/admin/user";
import { getUserId } from "@/utils/utils";

const user = ref({ full_name: "Chưa xác định", total_point: 0 });
const userRank = reactive({ rank: { rankName: "Vô Hạng" } });

onMounted(async () => {
  try {
    const userRes = await fetchUserDetail(getUserId());
    if (userRes.data?.data) {
      user.value = userRes.data.data;
      console.log("User data loaded:", user.value);
    }

    const rankRes = await getUserRank(getUserId());
    const rankList = rankRes.data?.data;

    if (Array.isArray(rankList)) {
      const activeRank = rankList.find((item) => item.status === 1); // ✅ đúng status cấp ngoài
      if (activeRank) {
        userRank.rank = activeRank.rank;
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
});

const rankClass = computed(() => {
  switch (userRank.rank.rankName) {
    case "BẠC":
      return "rank-silver";
    case "VÀNG":
      return "rank-gold";
    case "KIM CƯƠNG":
      return "rank-diamond";
    default:
      return "";
  }
});
</script>
<style scoped>
.profile-benefits {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.member-status-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.member-avatar .crown-icon {
  display: inline-block;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.member-rank {
  background: #e8e8e8;
  color: #666;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
}

.member-rank.rank-silver {
  background: #c0c0c0; /* Màu bạc */
  color: #333;
}

.member-rank.rank-gold {
  background: #ffd700; /* Màu vàng */
  color: #333;
}

.member-rank.rank-diamond {
  background: #b9f2ff; /* Màu kim cương */
  color: #333;
}

.member-points {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.rank-progress {
  font-size: 13px;
  color: #666;
}

.rank-progress .highlight {
  color: #dc3545;
  font-weight: 600;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.tier-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
}

.tier-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.tier-tab:hover {
  color: #333;
}

.tier-tab.active {
  color: #dc3545;
  border-bottom-color: #dc3545;
}

.tier-icon {
  font-size: 16px;
}

.benefits-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.benefit-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.tier-requirements {
  padding: 16px;
  background: white;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #d2e2ee;
  border-left: 4px solid #d2e2ee;
}

.tier-requirements h5 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.tier-requirements p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.benefits-summary {
  border-top: 1px solid white;
  border-top: 1px solid white;
  padding-top: 32px;
}

.benefit-card {
  text-align: center;
  padding: 24px 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.benefit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.benefit-card h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.benefit-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .profile-benefits {
    padding: 16px;
  }


  .tier-tabs {
    flex-direction: column;
    gap: 0;
  }


  .tier-tab {
    border-bottom: 1px solid #e9ecef;
    border-radius: 0;
    justify-content: flex-start;
  }


  .tier-tab.active {
    background: #f8f9fa;
    border-left: 4px solid #dc3545;
  }


  .benefit-card {
    margin-bottom: 16px;
  }
}
</style>
