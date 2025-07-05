<template>
    <header class="header-section">
        <!-- Header chính với logo, search và icons -->
        <div class="main-header bg-white shadow-sm">
            <div class="container-fluid">
                <div class="row align-items-center" style="height: 60px;">
                    
                    <!-- Logo -->
                    <div class="col-auto">
                        <div class="logo me-4">
                            <RouterLink to="/">
                                <img src="https://cdn1.fahasa.com/media/catalog/product/9/7/9786043462111_1.jpg" alt="Fahasa Logo" style="height: 40px;">
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Categories dropdown (màu đỏ) -->
                    <div class="col-auto bg-danger text-white d-flex align-items-center px-3" style="height: 60px;">
                        <div class="dropdown">
                            <button class="btn btn-danger dropdown-toggle border-0 d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-grid-3x3-gap"></i>
                                <span class="fw-bold d-none d-md-inline">Danh mục sản phẩm</span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Văn học</a></li>
                                <li><a class="dropdown-item" href="#">Kinh tế</a></li>
                                <li><a class="dropdown-item" href="#">Thiếu nhi</a></li>
                                <li><a class="dropdown-item" href="#">Giáo khoa</a></li>
                                <li><a class="dropdown-item" href="#">Kỹ năng sống</a></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Search bar (nền xám) -->
                    <div class="col bg-light d-flex align-items-center px-3" style="height: 60px;">
                        <div class="input-group w-100">
                            <input type="text" class="form-control border-0 bg-transparent" placeholder="Bút chì đọc - Học tiếng Anh" style="box-shadow: none;">
                            <button class="btn btn-danger px-4" type="button">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Right side icons -->
                    <div class="col-auto d-flex align-items-center gap-3 px-3" style="height: 60px;">
                        <!-- Notifications -->
                        <NotificationComponent mode="dropdown" />

                        <!-- Cart -->
                        <RouterLink to="/cart" class="d-flex flex-column align-items-center text-decoration-none text-dark position-relative">
                            <i class="bi bi-cart3 fs-5"></i>
                            <small class="text-muted" style="font-size: 11px;">Giỏ Hàng</small>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 9px;">0</span>
                        </RouterLink>

                        <!-- Account -->
                        <div class="user-link position-relative d-flex flex-column align-items-center text-decoration-none text-dark" style="cursor:pointer;">
                            <!-- <img src="https://cdn1.fahasa.com/media/catalog/product/9/7/9786043462111_1.jpg" alt="account" class="avatar" /> -->
                             <div class="avatar d-flex align-items-center justify-content-center">
                                 <i class=" bi bi-person-circle"></i>
                             </div>
                            <small class="text-muted" style="font-size: 11px;">Tài khoản</small>
                            <div class="user-link-dropdown">
                                <RouterLink to="/profile" class="user-dropdown">
                                    <i class="bi bi-person-circle"></i>
                                    <span>Hồ sơ</span>
                                </RouterLink>
                                <RouterLink to="/profile/orders" class="user-dropdown">
                                    <i class="bi bi-bag"></i>
                                    <span>Đơn hàng</span>
                                </RouterLink>
                                <RouterLink to="/profile/settings" class="user-dropdown">
                                    <i class="bi bi-gear"></i>
                                    <span>Cài đặt</span>
                                </RouterLink>
                                <div class="divider"></div>
                                <a href="#" class="user-dropdown" @click.prevent="handleLogout">
                                    <i class="bi bi-box-arrow-right"></i>
                                    <span>Đăng xuất</span>
                                </a>
                            </div>
                        </div>

                        <!-- Language -->
                        <!-- <div class="d-flex align-items-center">
                            <img src="https://flagcdn.com/16x12/vn.png" alt="VN" class="me-1">
                            <i class="bi bi-chevron-down small"></i>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation menu dưới -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-top">
            <div class="container-fluid px-3">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <RouterLink class="nav-link fw-semibold text-dark" to="/">Trang chủ</RouterLink>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="#">Sách hot</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="#">Sách mới</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="#">Flash Sale</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="#">Khuyến mãi</a>
                        </li>
                    </ul>
                    
                    <div class="d-flex align-items-center gap-3">
                        <small class="text-muted">
                            <i class="bi bi-telephone me-1"></i>
                            1900-1234
                        </small>
                        <small class="text-muted">
                            <i class="bi bi-envelope me-1"></i>
                            support@bookstation.com
                        </small>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import NotificationComponent from '@/components/common/NotificationComponent.vue'
import { useRouter } from 'vue-router'
import { showQuickConfirm, showToast } from '@/utils/swalHelper'
import { clearAuth } from '@/utils/utils'

const router = useRouter();

const handleLogout = async () => {
    const result = await showQuickConfirm("Xác nhận đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?");
    if(result.isConfirmed) {
        showToast('success', 'Đăng xuất thành công');
        clearAuth();
        router.push('/auth');
    }
}
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Header styling giống Fahasa */
.main-header {
    border-bottom: 1px solid #e9ecef;
}

.main-header .row {
    margin: 0;
}

.main-header .col-auto,
.main-header .col {
    padding: 0;
}

.logo img {
    height: 40px;
    width: auto;
}

/* Search bar styling */
.input-group input:focus {
    box-shadow: none !important;
    border: none !important;
    outline: none !important;
}

.bg-light {
    background-color: #f8f9fa !important;
}

/* Dropdown button styling */
.dropdown-toggle::after {
    margin-left: 0.5rem;
}

/* Navigation styling */
.navbar-nav .nav-link {
    font-weight: 500;
    color: #495057 !important;
    transition: color 0.3s ease;
    padding: 0.75rem 1rem !important;
}

.navbar-nav .nav-link:hover {
    color: #dc3545 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .main-header .col-auto:nth-child(2) {
        display: none !important;
    }
    
    .d-none.d-md-inline {
        display: none !important;
    }
}

/* Badge styling */
.badge {
    font-size: 9px;
}

/* Icon spacing */
.d-flex.flex-column small {
    margin-top: 2px;
    font-size: 11px;
}

/* Account dropdown styling */
.user-link {
    position: relative;
    display: inline-block;
    z-index: 1000;
}
.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #dc3545;
    margin-bottom: 2px;
    transition: box-shadow 0.2s;
}
.avatar:hover {
    box-shadow: 0 0 0 3px #ffe0e0;
}
.user-link-dropdown {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    border-radius: 10px;
    min-width: 180px;
    z-index: 100;
    padding: 10px 0;
    animation: fadeIn 0.2s;
}
.user-link:hover .user-link-dropdown,
.user-link .user-link-dropdown:hover {
    display: block;
}
.user-dropdown {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    color: #333;
    text-decoration: none;
    font-size: 1rem;
    transition: background 0.18s;
    cursor: pointer;
}
.user-dropdown i {
    margin-right: 10px;
    font-size: 1.2rem;
}
.user-dropdown:hover {
    background: #f1f5fa;
    color: #dc3545;
}
.divider {
    height: 1px;
    background: #e5e7eb;
    margin: 8px 0;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px);}
    to { opacity: 1; transform: translateY(0);}
}

/* Cart icon hover effect */
.d-flex.flex-column.align-items-center:hover {
    color: #dc3545 !important;
    transform: translateY(-1px);
    transition: all 0.3s ease;
}

.d-flex.flex-column.align-items-center:hover i {
    color: #dc3545 !important;
}

.d-flex.flex-column.align-items-center:hover small {
    color: #dc3545 !important;
}

/* Logo RouterLink styling */
.logo a {
    display: block;
    text-decoration: none;
}

/* NavLink RouterLink styling */
.nav-link.router-link-active {
    color: #dc3545 !important;
    font-weight: bold;
}
</style>
