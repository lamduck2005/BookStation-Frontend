<script setup>
import Trend from '@/views/client/Trend.vue'
</script>

<template>
    <div class="home-page">
        <!-- Hero section -->
        <section class="hero-section bg-light py-5">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-4 fw-bold text-primary mb-4">Chào mừng đến với BookStation</h1>
                        <p class="lead text-muted mb-4">Khám phá thế giới sách với hàng ngàn đầu sách hay, từ văn học đến khoa học, từ thiếu nhi đến kinh doanh.</p>
                        <div class="d-flex gap-3">
                            <button class="btn btn-danger btn-lg px-4">Mua sắm ngay</button>
                            <button class="btn btn-outline-danger btn-lg px-4">Khám phá</button>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="text-center">
                            <img src="https://via.placeholder.com/500x300?text=Hero+Image" alt="Hero" class="img-fluid rounded shadow">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trend section -->
        <Trend />
      
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
</style>