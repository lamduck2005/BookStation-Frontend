<template>
  <div class="profile-card">
    <!-- Background decoration -->
    <div class="decoration-elements">
      <div class="sparkle sparkle-1"></div>
      <div class="sparkle sparkle-2"></div>
      <div class="sparkle sparkle-3"></div>
      <div class="sparkle sparkle-4"></div>
    </div>

    <!-- Mascot penguin -->
    <div class="mascot-container">
      <img
        src="/src/assets/img/duck.png"
        alt="Penguin Mascot"
        class="penguin-image"
      />
    </div>

    <!-- User stats section -->
    <div class="stats-section">
      <div class="stats-row">
        <div class="stat-item">
          <h3>Ưu đãi của bạn</h3>
        </div>
        <div class="stat-item">
          <h3>Thành tích năm 2025</h3>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-detail">
            <span class="label">F-Point hiện có</span>
            <span class="value red">{{ user.currentFPoints || 0 }}</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-detail">
            <span class="label">Số đơn hàng</span>
            <span class="value red">{{ user.orderCount || 0 }} đơn hàng</span>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-detail">
            <span class="label">Freeship hiện có</span>
            <span class="value red">{{ user.freeshipCount || 0 }} lần</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-detail">
            <span class="label">Đã thanh toán</span>
            <span class="value red">{{ user.totalPaid || 0 }} đ</span>
          </div>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script>
export default {
  name: 'ProfileCardBog',
  emits: ['profile-card-bog']
}
</script>

<style scoped>
.profile-card {
  background: linear-gradient(135deg, #a5afb7 0%, #ffffff 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Decoration elements */
.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
}

.sparkle-1 {
  top: 15%;
  left: 10%;
  animation: twinkle 2s infinite;
}

.sparkle-2 {
  top: 25%;
  right: 15%;
  animation: twinkle 2s infinite 0.5s;
}

.sparkle-3 {
  top: 45%;
  left: 5%;
  animation: twinkle 2s infinite 1s;
}

.sparkle-4 {
  top: 35%;
  right: 5%;
  animation: twinkle 2s infinite 1.5s;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Close button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #333;
}

/* Member status */
.member-status {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.arrow-right {
  font-size: 12px;
}

/* Mascot penguin */
.mascot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.penguin-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  margin-bottom: 10px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  border-radius: 0;
}

.platform {
  width: 120px;
  height: 15px;
  background: linear-gradient(to bottom, #bbb, #999);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Stats section */
.stats-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin: 0px 10px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.12), 0 1.5px 6px 0 rgba(0, 0, 0, 0.1);
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stat-item {
  flex: 1;
  padding: 0 10px;
}

.stat-item:first-child {
  border-right: 1px solid #eee;
  padding-right: 20px;
}

.stat-item:last-child {
  padding-left: 20px;
}

.stat-item h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  text-align: left;
}

.stat-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.value {
  font-size: 16px;
  font-weight: 600;
}

.value.red {
  color: #dc3545;
}

/* Promotion text */
.promotion-text {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-card {
    padding: 20px;
  }

  .stats-row {
    flex-direction: column;
    gap: 15px;
  }

  .stat-item:first-child {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    padding-right: 10px;
  }

  .stat-item:last-child {
    padding-left: 10px;
    padding-top: 0;
  }
}
</style>
