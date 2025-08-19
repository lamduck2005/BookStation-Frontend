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

onMounted(async () => {
  try {
    const userId = getUserId();
    // Kiểm tra xem user đã nhận voucher chưa
    const resCheck = await getVoucherWithNewUserId(userId);
    if (
      resCheck &&
      resCheck.data &&
      resCheck.data.code &&
      resCheck.data.status !== 0 // Nếu status = 0 thì không hiển thị
    ) {
      // Đã có voucher hợp lệ, KHÔNG hiển thị popup
      return;
    }
  } catch (e) {
    // Nếu lỗi (chưa có voucher), tiếp tục hiển thị popup
    try {
      const res = await getVoucherWithNewUser();
      if (
        res &&
        res.data &&
        res.data.code &&
        res.data.status !== 0 // Nếu status = 0 thì không hiển thị
      ) {
        voucher.value = res.data;
        Swal.fire({
          title: `<span style="color:#1ecb6b;font-size:2rem;font-weight:bold;text-shadow:0 2px 8px #baffd1;">${voucher.value.name}</span>
       <button id="claim-btn" style="position:absolute;top:16px;right:16px;font-size:1.2rem;color:#1ecb6b;background:none;font-weight:bold;border:none;outline:none;box-shadow:none;border-radius:20px;padding:7px 22px;transition:color 0.2s, background 0.2s;cursor:pointer;" onmouseover="this.style.color='#fff';this.style.background='#1ecb6b';" onmouseout="this.style.color='#1ecb6b';this.style.background='none';">Nhận ngay</button>
        `,
          html: `
            <div style="display:flex;align-items:center;justify-content:center;gap:24px;position:relative;">
              <div style="flex:2;text-align:left;">
                <div style="font-size:1.2rem;font-weight:bold;margin-bottom:8px;color:#222;">${
                  voucher.value.name
                }</div>
                <div style="font-size:1.05rem;opacity:0.95;color:#333;">${
                  voucher.value.description
                }</div>
                <div style="margin-top:10px;font-size:1rem;">
                  <b>Mã:</b>
                  <span style="background:#ffe600;color:#1ecb6b;padding:3px 12px;border-radius:8px;font-weight:bold;box-shadow:0 2px 8px #ffe60080;">${
                    voucher.value.code
                  }</span>
                </div>
                <div style="margin-top:8px;font-size:1rem;color:#444;">
                  Đơn tối thiểu: <b style="color:#1ecb6b">${Number(
                    voucher.value.minOrderValue
                  ).toLocaleString()}đ</b><br>
                  Giảm tối đa: <b style="color:#1ecb6b">${Number(
                    voucher.value.maxDiscountValue
                  ).toLocaleString()}đ</b>
                </div>
              </div>
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
                <div style="position:relative;width:90px;height:90px;background:#fff;border-radius:18px;border:4px solid #ffe600;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px #ffe60055;">
                  <div style="position:absolute;top:-22px;left:50%;width:60px;height:30px;background:none;border-bottom:6px solid #ffe600;border-radius:50% 50% 0 0;transform:translateX(-50%);"></div>
                  <div style="color:#1ecb6b;font-size:1.15rem;font-weight:bold;text-align:center;line-height:1.1;text-shadow:0 2px 8px #baffd1;">Gift<br>Voucher</div>
                </div>
              </div>
              <div style="flex:1;display:flex;align-items:center;justify-content:flex-end;">
                <div style="background:#ffe600;color:#1ecb6b;font-size:2.4rem;font-weight:bold;border-radius:50%;width:100px;height:100px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px #ffe60080;text-shadow:0 2px 8px #baffd1;">
                  ${
                    voucher.value.voucherType === "PERCENTAGE"
                      ? `-${voucher.value.discountPercentage}%`
                      : `-${Number(
                          voucher.value.discountAmount
                        ).toLocaleString()}đ`
                  }
                </div>
              </div>
            </div>
          `,
          showConfirmButton: false,
          timer: 10000,
          width: 750,
          background: "linear-gradient(135deg,#e0ffe6 0%,#f8fff6 100%)",
          customClass: {
            popup: "voucher-popup",
          },
          didOpen: () => {
            const btn = document.getElementById("claim-btn");
            if (btn)
              btn.onclick = async function () {
                try {
                  await addVoucherForNewuser({
                    userId: Number(getUserId()), // phải là số
                    voucherId: Number(voucher.value.id), // phải là số
                  });
                  showToast("success", "Nhận thành công voucher");
                  Swal.close();
                } catch (e) {
                  showToast("error", "Có lỗi khi nhận voucher");
                }
              };
          },
        });
      }
    } catch (e) {
      // Không có voucher mới hoặc lỗi, không làm gì
    }
  }
});
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section .display-4 {
    font-size: 2rem;
  }
}

:deep(.swal2-popup.voucher-popup) {
  border: 4px dashed #ffd600;
  border-radius: 18px;
  box-shadow: 0 4px 16px #0001;
  padding: 0;
}
</style>
