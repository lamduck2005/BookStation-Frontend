<template>
  <div class="rating-statistics">
    <div class="stats-grid">
      <!-- Total books stat -->
      <div class="stat-card">
        <div class="stat-icon">
          <i class="bi bi-books"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ totalBooks }}</div>
          <div class="stat-label">Tổng sách yêu thích</div>
        </div>
        <div class="stat-trend positive">
          <i class="bi bi-arrow-up"></i>
        </div>
      </div>

      <!-- Average rating stat -->
      <div class="stat-card">
        <div class="stat-icon">
          <i class="bi bi-star-fill"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">4.8</div>
          <div class="stat-label">Điểm trung bình</div>
        </div>
        <div class="stat-trend positive">
          <i class="bi bi-arrow-up"></i>
        </div>
      </div>

      <!-- Happy readers stat -->
      <div class="stat-card">
        <div class="stat-icon">
          <i class="bi bi-emoji-smile"></i>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ happyReaders }}+</div>
          <div class="stat-label">Độc giả hài lòng</div>
        </div>
        <div class="stat-trend positive">
          <i class="bi bi-arrow-up"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalBooks: {
    type: Number,
    default: 0
  }
});

const happyReaders = computed(() => {
  return Math.floor(props.totalBooks * 150 + Math.random() * 50);
});
</script>

<style scoped>
.rating-statistics {
  margin: 20px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 12px 35px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.stat-card:nth-child(2) .stat-icon {
  background: linear-gradient(135deg, #ffd93d 0%, #ff9800 100%);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.stat-card:nth-child(3) .stat-icon {
  background: linear-gradient(135deg, #6bcf7f 0%, #4ecdc4 100%);
  box-shadow: 0 4px 15px rgba(107, 207, 127, 0.3);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

.stat-trend {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.stat-trend.positive {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.stat-trend i {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}
</style>
