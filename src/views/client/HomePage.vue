<script setup>
import Trend from "@/views/client/Trend.vue";
import HighRatingBooks from "@/views/client/HighRatingBooks.vue";
import { ref, onMounted } from "vue";
import { getUserFullName, getUserId, getUserEmail } from "@/utils/utils";
import {
  getVoucherWithNewUser,
  getVoucherWithNewUserId,
  addVoucherForNewuser,
} from "@/services/client/userVoucher";

import Swal from "sweetalert2";
import { showToast } from "@/utils/swalHelper";
import CategoryClient from "./CategoryClient.vue";
import FlashSaleProduct from "./FlashSaleProduct.vue";

const voucher = ref(null);

// onMounted(async () => {
//   try {
//     const userId = getUserId();
//     // Kiểm tra xem user đã nhận voucher chưa
//     const resCheck = await getVoucherWithNewUserId(userId);
//     if (
//       resCheck &&
//       resCheck.data &&
//       resCheck.data.code &&
//       resCheck.data.status !== 0 // Nếu status = 0 thì không hiển thị
//     ) {
//       // Đã có voucher hợp lệ, KHÔNG hiển thị popup
//       return;
//     }
//   } catch (e) {
//     // Nếu lỗi (chưa có voucher), tiếp tục hiển thị popup
//     try {
//       const res = await getVoucherWithNewUser();
//       if (
//         res &&
//         res.data &&
//         res.data.code &&
//         res.data.status !== 0 // Nếu status = 0 thì không hiển thị
//       ) {
//         voucher.value = res.data;
//         Swal.fire({
//           title: `<span style="color:#1ecb6b;font-size:2rem;font-weight:bold;text-shadow:0 2px 8px #baffd1;">${voucher.value.name}</span>
//        <button id="claim-btn" style="position:absolute;top:16px;right:16px;font-size:1.2rem;color:#1ecb6b;background:none;font-weight:bold;border:none;outline:none;box-shadow:none;border-radius:20px;padding:7px 22px;transition:color 0.2s, background 0.2s;cursor:pointer;" onmouseover="this.style.color='#fff';this.style.background='#1ecb6b';" onmouseout="this.style.color='#1ecb6b';this.style.background='none';">Nhận ngay</button>
//         `,
//           html: `
//             <div style="display:flex;align-items:center;justify-content:center;gap:24px;position:relative;">
//               <div style="flex:2;text-align:left;">
//                 <div style="font-size:1.2rem;font-weight:bold;margin-bottom:8px;color:#222;">${
//                   voucher.value.name
//                 }</div>
//                 <div style="font-size:1.05rem;opacity:0.95;color:#333;">${
//                   voucher.value.description
//                 }</div>
//                 <div style="margin-top:10px;font-size:1rem;">
//                   <b>Mã:</b>
//                   <span style="background:#ffe600;color:#1ecb6b;padding:3px 12px;border-radius:8px;font-weight:bold;box-shadow:0 2px 8px #ffe60080;">${
//                     voucher.value.code
//                   }</span>
//                 </div>
//                 <div style="margin-top:8px;font-size:1rem;color:#444;">
//                   Đơn tối thiểu: <b style="color:#1ecb6b">${Number(
//                     voucher.value.minOrderValue
//                   ).toLocaleString()}đ</b><br>
//                   Giảm tối đa: <b style="color:#1ecb6b">${Number(
//                     voucher.value.maxDiscountValue
//                   ).toLocaleString()}đ</b>
//                 </div>
//               </div>
//               <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
//                 <div style="position:relative;width:90px;height:90px;background:#fff;border-radius:18px;border:4px solid #ffe600;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px #ffe60055;">
//                   <div style="position:absolute;top:-22px;left:50%;width:60px;height:30px;background:none;border-bottom:6px solid #ffe600;border-radius:50% 50% 0 0;transform:translateX(-50%);"></div>
//                   <div style="color:#1ecb6b;font-size:1.15rem;font-weight:bold;text-align:center;line-height:1.1;text-shadow:0 2px 8px #baffd1;">Gift<br>Voucher</div>
//                 </div>
//               </div>
//               <div style="flex:1;display:flex;align-items:center;justify-content:flex-end;">
//                 <div style="background:#ffe600;color:#1ecb6b;font-size:2.4rem;font-weight:bold;border-radius:50%;width:100px;height:100px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px #ffe60080;text-shadow:0 2px 8px #baffd1;">
//                   ${
//                     voucher.value.voucherType === "PERCENTAGE"
//                       ? `-${voucher.value.discountPercentage}%`
//                       : `-${Number(
//                           voucher.value.discountAmount
//                         ).toLocaleString()}đ`
//                   }
//                 </div>
//               </div>
//             </div>
//           `,
//           showConfirmButton: false,
//           timer: 10000,
//           width: 750,
//           background: "linear-gradient(135deg,#e0ffe6 0%,#f8fff6 100%)",
//           customClass: {
//             popup: "voucher-popup",
//           },
//           didOpen: () => {
//             const btn = document.getElementById("claim-btn");
//             if (btn)
//               btn.onclick = async function () {
//                 try {
//                   await addVoucherForNewuser({
//                     userId: Number(getUserId()), // phải là số
//                     voucherId: Number(voucher.value.id), // phải là số
//                   });
//                   showToast("success", "Nhận thành công voucher");
//                   Swal.close();
//                 } catch (e) {
//                   showToast("error", "Có lỗi khi nhận voucher");
//                 }
//               };
//           },
//         });
//       }
//     } catch (e) {
//       // Không có voucher mới hoặc lỗi, không làm gì
//     }
//   }
// });
</script>

<template>
  <div class="home-page">
    <!-- Hero section -->
    <section class="hero-section bg-light py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-primary mb-4">
              Chào mừng đến với BookStation
            </h1>
            <p class="lead text-muted mb-4">
              Khám phá thế giới sách với hàng ngàn đầu sách hay, từ văn học đến
              khoa học, từ thiếu nhi đến kinh doanh.
            </p>
            <div class="d-flex gap-3">
              <button class="btn btn-danger btn-lg px-4">Mua sắm ngay</button>
              <button class="btn btn-outline-danger btn-lg px-4">
                Khám phá
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <img
                src="https://via.placeholder.com/500x300?text=Hero+Image"
                alt="Hero"
                class="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Minigame Banner Section -->
    <section class="minigame-banner py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div class="minigame-content">
              <div class="minigame-badge mb-3">
                <i class="bi bi-gift-fill me-2"></i>
                🎮 MINIGAME MỚI
              </div>
              <h2 class="minigame-title mb-3">
                Mở Hộp Quà Thần Bí
              </h2>
              <p class="minigame-desc mb-4">
                Tham gia minigame mở hộp để nhận những phần thưởng hấp dẫn! 
                Voucher giảm giá, điểm thưởng và nhiều quà tặng đang chờ bạn khám phá.
              </p>
              <div class="minigame-features mb-4">
                <div class="feature-item">
                  <i class="bi bi-gift text-success"></i>
                  <span> dùng lượt miễn phí mỗi ngày</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-coin text-warning"></i>
                  <span>Dùng điểm để mở thêm</span>
                </div>
                <div class="feature-item">
                  <i class="bi bi-trophy text-danger"></i>
                  <span>Phần thưởng giá trị</span>
                </div>
              </div>
              <RouterLink to="/minigame" class="btn btn-minigame btn-lg">
                <i class="bi bi-play-circle-fill me-2"></i>
                Chơi ngay!
              </RouterLink>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="minigame-visual">
              <div class="mystery-boxes">
                <div class="mystery-box box-1">
                  <div class="box-lid"></div>
                  <div class="box-body"></div>
                  <div class="sparkles">
                    <div class="sparkle s1"></div>
                    <div class="sparkle s2"></div>
                    <div class="sparkle s3"></div>
                  </div>
                </div>
                <div class="mystery-box box-2">
                  <div class="box-lid"></div>
                  <div class="box-body"></div>
                </div>
                <div class="mystery-box box-3">
                  <div class="box-lid"></div>
                  <div class="box-body"></div>
                </div>
              </div>
              <div class="floating-rewards">
                <div class="reward reward-1">🎁</div>
                <div class="reward reward-2">💎</div>
                <div class="reward reward-3">🏆</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <Trend id="Trend"/>

    <div class="container mt-5">
      <CategoryClient id="category-client"/>
      <FlashSaleProduct id="flashsale-product"/>
      <HighRatingBooks id="high-rating-books"/>
    </div>
    <!-- Trend section -->
  </div>
</template>

<style scoped>
/* Hero section */
.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Minigame Banner */
.minigame-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.minigame-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="15" cy="15" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
  opacity: 0.3;
}

.minigame-content {
  position: relative;
  z-index: 2;
}

.minigame-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
  animation: pulse 2s infinite;
}

.minigame-title {
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #fff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.minigame-desc {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}

.minigame-features {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
}

.feature-item i {
  font-size: 1.2rem;
  padding: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-minigame {
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  border: none;
  color: #333;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-minigame:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
  color: #333;
}

/* Minigame Visual */
.minigame-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mystery-boxes {
  position: relative;
  display: flex;
  gap: 1rem;
  perspective: 1000px;
}

.mystery-box {
  width: 80px;
  height: 80px;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

.mystery-box.box-2 {
  animation-delay: -1s;
  transform: scale(1.2);
  z-index: 2;
}

.mystery-box.box-3 {
  animation-delay: -2s;
}

.box-lid, .box-body {
  position: absolute;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.box-lid {
  width: 100%;
  height: 30px;
  top: 0;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  border: 2px solid #fff;
  z-index: 2;
}

.box-body {
  width: 100%;
  height: 50px;
  bottom: 0;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  border: 2px solid #fff;
}

.sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
}

.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ffd700;
  border-radius: 50%;
  animation: sparkle 2s infinite;
}

.sparkle.s1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.sparkle.s2 {
  top: 60%;
  right: 15%;
  animation-delay: 0.7s;
}

.sparkle.s3 {
  bottom: 20%;
  left: 50%;
  animation-delay: 1.4s;
}

.floating-rewards {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.reward {
  position: absolute;
  font-size: 2rem;
  animation: floatReward 4s ease-in-out infinite;
}

.reward-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.reward-2 {
  top: 60%;
  right: 20%;
  animation-delay: 1.3s;
}

.reward-3 {
  bottom: 30%;
  left: 60%;
  animation-delay: 2.6s;
}

/* Animations */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes sparkle {
  0%, 100% { 
    opacity: 0;
    transform: scale(0.5);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes floatReward {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-15px) rotate(180deg);
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section .display-4 {
    font-size: 2rem;
  }
  
  .minigame-title {
    font-size: 2rem;
  }
  
  .minigame-features {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .mystery-boxes {
    flex-direction: column;
    align-items: center;
  }
  
  .mystery-box {
    width: 60px;
    height: 60px;
  }
}

:deep(.swal2-popup.voucher-popup) {
  border: 4px dashed #ffd600;
  border-radius: 18px;
  box-shadow: 0 4px 16px #0001;
  padding: 0;
}
</style>
