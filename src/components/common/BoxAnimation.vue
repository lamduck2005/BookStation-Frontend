<template>
  <div class="box-container">
    <!-- Hộp quà chính -->
    <div 
      class="gift-box" 
      :class="{ 
        'opening': isOpening, 
        'opened': isOpened,
        'shake': isShaking,
        'glow': glowEffect
      }"
      @click="handleBoxClick"
    >
      <!-- Nắp hộp -->
      <div class="box-lid">
        <div class="box-ribbon-v"></div>
        <div class="box-ribbon-h"></div>
        <div class="bow">
          <div class="bow-left"></div>
          <div class="bow-right"></div>
          <div class="bow-center"></div>
        </div>
      </div>
      
      <!-- Thân hộp -->
      <div class="box-body">
        <div class="box-ribbon-v"></div>
        <div class="box-ribbon-h"></div>
      </div>

      <!-- Hiệu ứng sparkle -->
      <div v-if="showSparkles" class="sparkles">
        <div v-for="i in 8" :key="i" :class="`sparkle sparkle-${i}`">✨</div>
      </div>
    </div>

    <!-- Nút mở hộp -->
    <div class="box-controls" v-if="!isOpening && !isOpened">
      <button 
        class="open-btn free-btn" 
        @click="$emit('open-box', 'FREE')"
        :disabled="!canOpenFree"
        :class="{ disabled: !canOpenFree }"
      >
        <i class="fas fa-gift"></i>
        <span>Mở Miễn Phí</span>
        <small v-if="freeRemaining !== null">({{ freeRemaining }}/{{ freeLimit }} lượt)</small>
      </button>
      
      <button 
        class="open-btn point-btn" 
        @click="$emit('open-box', 'POINT')"
        :disabled="!canOpenPoint"
        :class="{ disabled: !canOpenPoint }"
      >
        <i class="fas fa-coins"></i>
        <span>Mở Bằng Điểm</span>
        <small v-if="pointCost">({{ pointCost }} điểm)</small>
      </button>
    </div>

    <!-- Hiển thị kết quả -->
    <div v-if="isOpened && result" class="result-display">
      <div class="result-content" :class="`result-${result.animationType}`">
        <div v-if="result.hasReward" class="reward-result">
          <div class="reward-icon">
            <i v-if="result.rewardType === 'VOUCHER'" class="fas fa-ticket-alt"></i>
            <i v-else-if="result.rewardType === 'POINTS'" class="fas fa-coins"></i>
          </div>
          <h3>🎉 {{ result.message }}</h3>
          <div class="reward-details">
            <p class="reward-name">{{ result.rewardName }}</p>
            <p v-if="result.rewardDescription" class="reward-desc">{{ result.rewardDescription }}</p>
            <p v-if="result.voucherCode" class="voucher-code">
              Mã: <strong>{{ result.voucherCode }}</strong>
            </p>
          </div>
        </div>
        <div v-else class="no-reward-result">
          <div class="no-reward-icon">😔</div>
          <h3>{{ result.message }}</h3>
          <p>Đừng bỏ cuộc! Thử lại lần sau nhé!</p>
        </div>
        
        <button class="close-result-btn" @click="closeResult">
          <i class="fas fa-times"></i>
          Đóng
        </button>
      </div>
    </div>

    <!-- Hiệu ứng fireworks khi trúng lớn -->
    <div v-if="showFireworks" class="fireworks">
      <div v-for="i in 5" :key="i" :class="`firework firework-${i}`"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpening: {
    type: Boolean,
    default: false
  },
  result: {
    type: Object,
    default: null
  },
  canOpenFree: {
    type: Boolean,
    default: true
  },
  canOpenPoint: {
    type: Boolean,
    default: true
  },
  freeRemaining: {
    type: Number,
    default: null
  },
  freeLimit: {
    type: Number,
    default: null
  },
  pointCost: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['open-box', 'result-closed'])

const isOpened = ref(false)
const isShaking = ref(false)
const showSparkles = ref(false)
const showFireworks = ref(false)
const glowEffect = ref(false)

// Xử lý hiệu ứng khi mở hộp
watch(() => props.isOpening, (newVal) => {
  if (newVal) {
    startOpeningAnimation()
  }
})

// Xử lý kết quả
watch(() => props.result, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      isOpened.value = true
      showResultAnimation(newVal)
    }, 2000) // Sau 2s animation mở hộp
  }
})

const startOpeningAnimation = () => {
  // Bắt đầu rung lắc
  isShaking.value = true
  glowEffect.value = true
  
  // Hiệu ứng sparkle
  setTimeout(() => {
    showSparkles.value = true
  }, 500)
  
  // Kết thúc animation
  setTimeout(() => {
    isShaking.value = false
    showSparkles.value = false
  }, 2000)
}

const showResultAnimation = (result) => {
  if (result.animationType === 'big_win') {
    showFireworks.value = true
    setTimeout(() => {
      showFireworks.value = false
    }, 3000)
  }
}

const handleBoxClick = () => {
  if (props.isOpening || isOpened.value) return
  
  // Nếu chưa chọn loại mở thì mặc định là FREE
  if (props.canOpenFree) {
    emit('open-box', 'FREE')
  } else if (props.canOpenPoint) {
    emit('open-box', 'POINT')
  }
}

const closeResult = () => {
  isOpened.value = false
  emit('result-closed')
}
</script>

<style scoped>
.box-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

/* Gift Box Styles */
.gift-box {
  position: relative;
  width: 120px;
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gift-box:hover:not(.opening):not(.opened) {
  transform: scale(1.05);
}

.gift-box.glow {
  filter: drop-shadow(0 0 20px #fbbf24);
}

.gift-box.shake {
  animation: shake 0.5s ease-in-out infinite;
}

.gift-box.opening .box-lid {
  transform: rotateX(-90deg) translateZ(40px);
  animation: lidOpen 2s ease-in-out;
}

.gift-box.opened .box-lid {
  transform: rotateX(-180deg) translateZ(40px);
}

/* Box Components */
.box-body {
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.box-lid {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 8px;
  position: absolute;
  top: -20px;
  z-index: 2;
  transform-origin: bottom;
  transition: transform 2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Ribbon */
.box-ribbon-v {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 100%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.box-ribbon-h {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 8px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

/* Bow */
.bow {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 16px;
}

.bow-left, .bow-right {
  position: absolute;
  width: 10px;
  height: 16px;
  background: #fbbf24;
  border-radius: 50%;
}

.bow-left {
  left: 0;
  transform: skewY(-10deg);
}

.bow-right {
  right: 0;
  transform: skewY(10deg);
}

.bow-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 16px;
  background: #f59e0b;
  border-radius: 2px;
}

/* Controls */
.box-controls {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.open-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 120px;
}

.free-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.free-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
}

.point-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.point-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 158, 11, 0.4);
}

.open-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.open-btn i {
  font-size: 20px;
}

.open-btn small {
  font-size: 11px;
  opacity: 0.9;
}

/* Result Display */
.result-display {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.result-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.5s ease;
}

.result-big_win {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 3px solid #f59e0b;
}

.reward-result .reward-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.reward-result h3 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 16px;
}

.reward-details {
  margin-bottom: 20px;
}

.reward-name {
  font-size: 20px;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 8px;
}

.reward-desc {
  color: #6b7280;
  margin-bottom: 8px;
}

.voucher-code {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
}

.no-reward-result .no-reward-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.close-result-btn {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.close-result-btn:hover {
  background: #4b5563;
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-2px) rotate(-1deg); }
  75% { transform: translateX(2px) rotate(1deg); }
}

@keyframes lidOpen {
  0% { transform: rotateX(0deg) translateZ(0px); }
  50% { transform: rotateX(-45deg) translateZ(20px); }
  100% { transform: rotateX(-90deg) translateZ(40px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Sparkles */
.sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 16px;
  animation: sparkleFloat 1s ease-out forwards;
}

.sparkle-1 { top: 20%; left: 20%; animation-delay: 0s; }
.sparkle-2 { top: 30%; right: 20%; animation-delay: 0.1s; }
.sparkle-3 { bottom: 30%; left: 15%; animation-delay: 0.2s; }
.sparkle-4 { bottom: 20%; right: 15%; animation-delay: 0.3s; }
.sparkle-5 { top: 50%; left: -10%; animation-delay: 0.4s; }
.sparkle-6 { top: 50%; right: -10%; animation-delay: 0.5s; }
.sparkle-7 { top: 10%; left: 50%; animation-delay: 0.6s; }
.sparkle-8 { bottom: 10%; left: 50%; animation-delay: 0.7s; }

@keyframes sparkleFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0);
  }
}

/* Fireworks */
.fireworks {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
}

.firework {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fbbf24;
  border-radius: 50%;
}

.firework-1 {
  top: 20%;
  left: 20%;
  animation: fireworkExplode 2s ease-out;
}

.firework-2 {
  top: 30%;
  right: 20%;
  animation: fireworkExplode 2s ease-out 0.5s;
}

.firework-3 {
  top: 40%;
  left: 50%;
  animation: fireworkExplode 2s ease-out 1s;
}

.firework-4 {
  bottom: 40%;
  left: 30%;
  animation: fireworkExplode 2s ease-out 1.5s;
}

.firework-5 {
  bottom: 30%;
  right: 30%;
  animation: fireworkExplode 2s ease-out 2s;
}

@keyframes fireworkExplode {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0px #fbbf24;
  }
  100% {
    transform: scale(0);
    box-shadow: 
      0 0 0 30px transparent,
      0 0 0 60px transparent,
      0 0 0 90px transparent;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .gift-box {
    width: 100px;
    height: 100px;
  }
  
  .box-controls {
    gap: 12px;
  }
  
  .open-btn {
    min-width: 100px;
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .result-content {
    padding: 20px;
    width: 95%;
  }
}
</style>
