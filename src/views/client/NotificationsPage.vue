<template>
    <div class="notifications-page">
        <!-- Header -->
        <!-- <Header /> -->
        
        <!-- Main Content -->
        <div class="container my-4">
            <div class="row">
                <div class="col-12">
                    <!-- Page Header -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="fw-bold">Thông báo của tôi</h2>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary" @click="goBack">
                                <i class="bi bi-arrow-left me-2"></i>
                                Quay lại
                            </button>
                        </div>
                    </div>

                    <!-- Notification Component - Fullsize -->
                    <div class="card shadow-sm">
                        <NotificationComponent 
                            mode="fullsize" 
                            title="Tất cả thông báo"
                            height="600px"
                            max-height="800px"
                            :items-per-page="15"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import NotificationComponent from '@/components/common/NotificationComponent.vue'

const router = useRouter()

const goBack = () => {
    router.go(-1)
}
</script>

<style scoped>
.notifications-page {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .notifications-page {
        background-color: white;
    }
}
</style>
