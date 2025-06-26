<template>
    <div class="demo-page">
        <Header />
        
        <div class="container my-5">
            <h1 class="text-center mb-5">Demo NotificationComponent</h1>
            
            <!-- Demo 1: Component dạng dropdown nhỏ -->
            <div class="row mb-5">
                <div class="col-12">
                    <h3 class="mb-3">1. Component dạng dropdown (trong Header)</h3>
                    <p class="text-muted mb-3">Component này đã được tích hợp vào Header, click vào icon chuông ở header để xem.</p>
                </div>
            </div>

            <!-- Demo 2: Component fullsize với kích thước tùy chỉnh -->
            <div class="row mb-5">
                <div class="col-12">
                    <h3 class="mb-3">2. Component fullsize - Kích thước vừa (400px)</h3>
                    <div class="card shadow">
                        <NotificationComponent 
                            mode="fullsize" 
                            title="Thông báo - Kích thước vừa"
                            height="400px"
                            :items-per-page="5"
                        />
                    </div>
                </div>
            </div>

            <!-- Demo 3: Component fullsize với kích thước lớn -->
            <div class="row mb-5">
                <div class="col-12">
                    <h3 class="mb-3">3. Component fullsize - Kích thước lớn (600px)</h3>
                    <div class="card shadow">
                        <NotificationComponent 
                            mode="fullsize" 
                            title="Thông báo - Kích thước lớn"
                            height="600px"
                            :items-per-page="8"
                        />
                    </div>
                </div>
            </div>

            <!-- Demo 4: Component trong layout 2 cột -->
            <div class="row mb-5">
                <div class="col-md-6">
                    <h4 class="mb-3">4a. Component nhỏ (300px)</h4>
                    <div class="card shadow">
                        <NotificationComponent 
                            mode="fullsize" 
                            title="Thông báo"
                            height="300px"
                            :items-per-page="3"
                        />
                    </div>
                </div>
                <div class="col-md-6">
                    <h4 class="mb-3">4b. Component nhỏ khác (300px)</h4>
                    <div class="card shadow">
                        <NotificationComponent 
                            mode="fullsize" 
                            title="Cảnh báo hệ thống"
                            height="300px"
                            :items-per-page="4"
                        />
                    </div>
                </div>
            </div>

            <!-- Demo 5: Component compact -->
            <div class="row mb-5">
                <div class="col-12">
                    <h3 class="mb-3">5. Component compact - Chỉ hiển thị 200px</h3>
                    <div class="card shadow">
                        <NotificationComponent 
                            mode="fullsize" 
                            title="Thông báo nhanh"
                            height="200px"
                            :items-per-page="2"
                        />
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="text-center">
                <router-link to="/" class="btn btn-primary me-3">
                    <i class="bi bi-house me-2"></i>
                    Về trang chủ
                </router-link>
                <router-link to="/notifications" class="btn btn-outline-primary">
                    <i class="bi bi-bell me-2"></i>
                    Xem trang thông báo đầy đủ
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import NotificationComponent from '@/components/common/NotificationComponent.vue'
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f8f9fa;
}

.card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
}

h3, h4 {
    color: #333;
}

.text-muted {
    font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .row.mb-5 {
        margin-bottom: 2rem !important;
    }
}
</style>
