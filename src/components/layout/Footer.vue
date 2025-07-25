<template>
    <footer class="footer-section bg-white border-top">
        <div class="container py-5">
            <div class="row g-4">
                <!-- Thông tin công ty -->
                <div class="col-lg-3 col-md-6">
                    <div class="footer-brand mb-4">
                        <!-- <img src="@/assets/img/logo.png" alt="BookStation Logo" class="footer-logo mb-3" style="height: 40px;"> -->
                        <h5 class="fw-bold text-danger">BookStation.com</h5>
                    </div>
                    <address class="text-muted small mb-3">
                        <strong>Phú Kiều, Hà Nội, Việt Nam</strong><br>
                        Đồ án tốt nghiệp - BOOKSTATION<br>
                 
                    </address>
                    <p class="text-muted small">
                        BookStation.com nhận đặt hàng trực tuyến và giao hàng tận nơi. 
                    </p>
                    
                    
                    <!-- Social Media Icons -->
                    <!-- <div class="social-links mb-3">
                        <a href="#" class="text-muted me-3"><i class="bi bi-facebook fs-5"></i></a>
                        <a href="#" class="text-muted me-3"><i class="bi bi-instagram fs-5"></i></a>
                        <a href="#" class="text-muted me-3"><i class="bi bi-youtube fs-5"></i></a>
                        <a href="#" class="text-muted me-3"><i class="bi bi-tiktok fs-5"></i></a>
                        <a href="#" class="text-muted me-3"><i class="bi bi-twitter fs-5"></i></a>
                        <a href="#" class="text-muted"><i class="bi bi-pinterest fs-5"></i></a>
                    </div> -->
                    
                    
                </div>

                <!-- Dịch vụ -->
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold text-dark mb-3">DỊCH VỤ</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Điều khoản sử dụng</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chính sách bảo mật thông tin cá nhân</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chính sách bảo mật thanh toán</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Giới thiệu BookStation</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Hệ thống trung tâm - nhà sách</a></li>
                    </ul>
                </div>

                <!-- Hỗ trợ -->
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold text-dark mb-3">HỖ TRỢ</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chính sách đổi - trả - hoàn tiền</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chính sách bảo hành - bồi hoàn</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chính sách vận chuyển</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chính sách khách sỉ</a></li>
                    </ul>
                </div>

                <!-- Tài khoản của tôi -->
                <div class="col-lg-2 col-md-6">
                    <h6 class="fw-bold text-dark mb-3">TÀI KHOẢN CỦA TÔI</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Đăng nhập/Tạo mới tài khoản</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Thay đổi địa chỉ khách hàng</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Chi tiết tài khoản</a></li>
                        <li class="mb-2"><a href="#" class="text-muted text-decoration-none small">Lịch sử mua hàng</a></li>
                    </ul>
                </div>

                <!-- Liên hệ -->
                <div class="col-lg-3 col-md-6">
                    <h6 class="fw-bold text-dark mb-3">LIÊN HỆ</h6>
                    <div class="contact-info mb-3">
                        <p class="text-muted small mb-2">
                            <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                            Trường Cao Đẳng FPT Polytechnic
                        </p>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-envelope-fill text-danger me-2"></i>
                            cskh@bookstation.com
                        </p>
                        <p class="text-muted small mb-2">
                            <i class="bi bi-telephone-fill text-danger me-2"></i>
                            0123456789
                        </p>
                    </div>
                    
                    <!-- Payment methods -->
                    <div class="payment-methods mb-3">
                        <div class="row g-2">
                            <div class="col-4">
                                <img src="https://cdn0.fahasa.com/media/wysiwyg/Logo-NCC/vnpay_logo.png" 
                                     alt="VNPay" class="img-fluid" style="height: 30px;">
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-top py-3">
            <div class="container">
                <div class="text-center">
                    <small class="text-muted">
                        Copyright © 2025 BookStation. All rights reserved.
                    </small>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-section {
    margin-top: auto;
}

.footer-logo {
    max-height: 40px;
    width: auto;
}

.social-links a {
    transition: color 0.3s ease;
}

.social-links a:hover {
    color: #dc3545 !important;
}

.payment-methods img {
    max-height: 30px;
    width: auto;
    object-fit: contain;
}

.contact-info i {
    width: 16px;
}

@media (max-width: 768px) {
    .footer-section {
        font-size: 0.9rem;
    }
    
    .payment-methods .col-4 {
        margin-bottom: 0.5rem;
    }
}
</style>
