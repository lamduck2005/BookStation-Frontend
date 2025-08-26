<template>
  <div class="policies-page">
    <!-- Hero Section -->
    <div v-if="!isModal" class="hero-section bg-gradient-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-3">
              <i class="bi bi-shield-check me-3"></i>
              Chính Sách BookStation
            </h1>
            <p class="lead mb-0">
              Cam kết mang đến trải nghiệm mua sắm sách an toàn, minh bạch và đáng tin cậy
            </p>
          </div>
          <div class="col-lg-4 text-center">
            <div class="hero-icon">
              <i class="bi bi-book-half display-1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Pills -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-12">
          <nav class="policy-nav mb-4">
            <div class="nav nav-pills justify-content-center" role="tablist">
              <button 
                v-for="(policy, index) in policies" 
                :key="index"
                class="nav-link"
                :class="{ active: activePolicy === index }"
                @click="activePolicy = index"
                type="button"
              >
                <i :class="policy.icon" class="me-2"></i>
                {{ policy.title }}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Policy Content -->
    <div class="container pb-5">
      <div class="row">
        <div class="col-12">
          <div class="policy-content">
            <div v-for="(policy, index) in policies" :key="index" v-show="activePolicy === index">
              <div class="policy-card">
                <div class="card-header">
                  <h2 class="mb-0">
                    <i :class="policy.icon" class="me-3 text-primary"></i>
                    {{ policy.title }}
                  </h2>
                </div>
                <div class="card-body" v-html="policy.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Support Section -->
    <div class="support-section bg-light py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-12">
            <h3 class="mb-4">Cần hỗ trợ thêm?</h3>
            <p class="text-muted mb-4">Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            <div class="row">
              <div class="col-md-4">
                <div class="support-item">
                  <i class="bi bi-telephone-fill text-primary display-6"></i>
                  <h5 class="mt-3">Hotline</h5>
                  <p class="text-muted">1900-1234 (24/7)</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="support-item">
                  <i class="bi bi-envelope-fill text-primary display-6"></i>
                  <h5 class="mt-3">Email</h5>
                  <p class="text-muted">support@bookstation.vn</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="support-item">
                  <i class="bi bi-chat-dots-fill text-primary display-6"></i>
                  <h5 class="mt-3">Live Chat</h5>
                  <p class="text-muted">8:00 - 22:00 hàng ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PoliciesPage',
  props: {
    isModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activePolicy: 0,
      policies: [
        {
          title: 'Chính Sách Đổi Trả',
          icon: 'bi bi-arrow-repeat',
          content: `
            <div class="policy-section">
              <h4 class="text-primary mb-3"><i class="bi bi-clock-history me-2"></i>Thời Gian Đổi Trả</h4>
              <ul class="policy-list">
                <li><strong>7 ngày</strong> kể từ ngày nhận hàng cho sách mới</li>
                <li>Không áp dụng đổi trả đối với sách đã qua sử dụng hoặc có dấu hiệu bị hư hại</li>
              </ul>
              
              <h4 class="text-primary mb-3 mt-4"><i class="bi bi-check-circle me-2"></i>Điều Kiện Đổi Trả</h4>
              <div class="row">
                <div class="col-md-6">
                  <h5 class="text-success">✅ Được chấp nhận</h5>
                  <ul class="policy-list">
                    <li>Sách còn nguyên seal, chưa bóc bao bì</li>
                    <li>Không có vết bẩn, rách hoặc cong góc</li>
                    <li>Còn đầy đủ hóa đơn và phụ kiện kèm theo</li>
                    <li>Lỗi do nhà sản xuất hoặc vận chuyển</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h5 class="text-danger">❌ Không được chấp nhận</h5>
                  <ul class="policy-list">
                    <li>Sách đã qua sử dụng</li>
                    <li>Có mùi hôi, ẩm mốc</li>
                    <li>Mất hóa đơn mua hàng</li>
                    <li>Quá thời hạn đổi trả</li>
                  </ul>
                </div>
              </div>

              <div class="alert alert-info mt-4">
                <h5><i class="bi bi-info-circle me-2"></i>Quy Trình Đổi Trả</h5>
                <ol>
                  <li>Liên hệ hotline 1900-1234 hoặc email support@bookstation.vn</li>
                  <li>Cung cấp mã đơn hàng và lý do đổi trả</li>
                  <li>Đóng gói sản phẩm và gửi về địa chỉ chúng tôi cung cấp</li>
                  <li>Chúng tôi sẽ kiểm tra và xử lý trong 2-3 ngày làm việc</li>
                </ol>
              </div>
            </div>
          `
        },
        {
          title: 'Chính Sách Voucher',
          icon: 'bi bi-gift',
          content: `
            <div class="policy-section">
              <h4 class="text-primary mb-3"><i class="bi bi-ticket-perforated me-2"></i>Loại Voucher</h4>
              <div class="row">
                <div class="col-md-6">
                  <div class="voucher-type-card">
                    <h5 class="text-success"></i>Voucher Giảm Giá</h5>
                    <ul class="policy-list">
                      <li>Giảm theo phần trăm (5%, 10%, 15%...)</li>
                      <li>Giảm theo giá trị (5000đ, 10000đ, 20000đ...)</li>
                      <li>Có giá trị tối đa được giảm</li>
                      <li>Áp dụng cho toàn bộ đơn hàng</li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="voucher-type-card">
                    <h5 class="text-info"><i class="bi bi-truck me-2"></i>Voucher Freeship</h5>
                    <ul class="policy-list">
                      <li>giảm hoạc miễn phí vận chuyển toàn quốc</li>
                      <li>Không áp dụng cho vùng xa</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h4 class="text-primary mb-3 mt-4"><i class="bi bi-gear me-2"></i>Quy Tắc Sử Dụng</h4>
              <div class="alert alert-warning">
                <h6><i class="bi bi-exclamation-triangle me-2"></i>Lưu Ý Quan Trọng</h6>
                <ul class="policy-list mb-0">
                  <li>Mỗi đơn hàng chỉ được sử dụng tối đa <strong>2 voucher</strong></li>
                  <li>Không thể kết hợp voucher cùng loại (2 voucher giảm giá hoặc 2 voucher freeship)</li>
                  <li>Voucher có thời hạn sử dụng, vui lòng kiểm tra trước khi áp dụng</li>
                  <li>Voucher không được đổi thành tiền mặt</li>
                </ul>
              </div>

          `
        },
        {
          title: 'Chính Sách Vận Chuyển',
          icon: 'bi bi-truck',
          content: `
            <div class="policy-section">
              <h4 class="text-primary mb-3"><i class="bi bi-geo-alt me-2"></i>Phạm Vi Giao Hàng</h4>
              <div class="row">
                <div class="col-md-6">
                  <div class="shipping-zone">
                    <h5 class="text-success"><i class="bi bi-check-circle me-2"></i>Nội Thành</h5>
                    <ul class="policy-list">
                      <li><strong>TP.HCM:</strong> 1-2 ngày</li>
                      <li><strong>Hà Nội:</strong> 1-2 ngày</li>
                      <li><strong>Đà Nẵng:</strong> 1-2 ngày</li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="shipping-zone">
                    <h5 class="text-warning"><i class="bi bi-clock me-2"></i>Tỉnh Thành Khác</h5>
                    <ul class="policy-list">
                      <li><strong>Miền Bắc:</strong> 3-5 ngày</li>
                      <li><strong>Miền Trung:</strong> 3-4 ngày</li>
                      <li><strong>Miền Nam:</strong> 2-4 ngày</li>
                    </ul>
                  </div>
                </div>
              </div>
 
              <h4 class="text-primary mb-3 mt-4"><i class="bi bi-shield-check me-2"></i>Cam Kết Chất Lượng</h4>
              <div class="row">
                <div class="col-md-4 text-center">
                  <div class="commitment-item">
                    <i class="bi bi-box-seam text-primary display-4"></i>
                    <h6 class="mt-3">Đóng Gói Cẩn Thận</h6>
                    <p class="text-muted small">Sách được đóng gói kỹ lưỡng, chống ẩm và va đập</p>
                  </div>
                </div>
                <div class="col-md-4 text-center">
                  <div class="commitment-item">
                    <i class="bi bi-clock-history text-primary display-4"></i>
                    <h6 class="mt-3">Giao Hàng Đúng Hẹn</h6>
                    <p class="text-muted small">Cam kết giao hàng đúng thời gian đã thông báo</p>
                  </div>
                </div>
                <div class="col-md-4 text-center">
                  <div class="commitment-item">
                    <i class="bi bi-telephone text-primary display-4"></i>
                    <h6 class="mt-3">Hỗ Trợ 24/7</h6>
                    <p class="text-muted small">Theo dõi đơn hàng và hỗ trợ mọi lúc</p>
                  </div>
                </div>
              </div>
            </div>
          `
        },
        {
          title: 'Chính Sách Bảo Mật',
          icon: 'bi bi-shield-lock',
          content: `
            <div class="policy-section">
              <h4 class="text-primary mb-3"><i class="bi bi-person-check me-2"></i>Thu Thập Thông Tin</h4>
              <div class="alert alert-info">
                <h6><i class="bi bi-info-circle me-2"></i>Thông Tin Chúng Tôi Thu Thập</h6>
                <ul class="policy-list mb-0">
                  <li><strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại, địa chỉ</li>
                  <li><strong>Thông tin giao dịch:</strong> Lịch sử mua hàng, phương thức thanh toán</li>
                  <li><strong>Thông tin kỹ thuật:</strong> IP, trình duyệt, thiết bị truy cập</li>
                  <li><strong>Thông tin hành vi:</strong> Sản phẩm yêu thích, thời gian truy cập</li>
                  <li class="mt-2 text-danger"><i class="bi bi-envelope-x-fill me-2"></i><strong>Lưu ý:</strong> Email đăng ký tài khoản <u>không thể thay đổi</u> sau khi tạo tài khoản.</li>
                </ul>
              </div>

              <h4 class="text-primary mb-3 mt-4"><i class="bi bi-gear-fill me-2"></i>Mục Đích Sử Dụng</h4>
              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-success"><i class="bi bi-check2-circle me-2"></i>Được Phép</h6>
                  <ul class="policy-list">
                    <li>Xử lý đơn hàng và giao hàng</li>
                    <li>Hỗ trợ khách hàng</li>
                    <li>Gửi thông báo quan trọng</li>
                    <li>Cải thiện dịch vụ</li>
                    <li>Tuân thủ pháp luật</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6 class="text-danger"><i class="bi bi-x-circle me-2"></i>Không Được Phép</h6>
                  <ul class="policy-list">
                    <li>Bán thông tin cho bên thứ ba</li>
                    <li>Spam email marketing</li>
                    <li>Chia sẻ thông tin thanh toán</li>
                    <li>Sử dụng sai mục đích</li>
                    <li>Lưu trữ không cần thiết</li>
                  </ul>
                </div>
              </div>

               
              <div class="alert alert-warning mt-4">
                <h6><i class="bi bi-exclamation-triangle me-2"></i>Quyền Của Khách Hàng</h6>
                <ul class="policy-list mb-0">
                  <li>Xem, sửa đổi thông tin cá nhân</li>
                  <li>Yêu cầu xóa tài khoản</li>
                  <li>Từ chối nhận email marketing</li>
                  <li>Khiếu nại về việc sử dụng dữ liệu</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          title: 'Điều Khoản Sử Dụng',
          icon: 'bi bi-file-text',
          content: `
            <div class="policy-section">
              <h4 class="text-primary mb-3"><i class="bi bi-person-badge me-2"></i>Quyền và Nghĩa Vụ Khách Hàng</h4>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="rights-duties-card">
                    <h5 class="text-success"><i class="bi bi-check-circle me-2"></i>Quyền Lợi</h5>
                    <ul class="policy-list">
                      <li>Được cung cấp thông tin chính xác về sản phẩm</li>
                      <li>Được hỗ trợ và tư vấn nhiệt tình</li>
                      <li>Được bảo mật thông tin cá nhân</li>
                      <li>Được đổi trả sản phẩm theo quy định</li>
                      <li>Được khiếu nại khi có vấn đề phát sinh</li>
                      <li class="mt-2 text-warning"><i class="bi bi-cash-coin me-2"></i><strong>Lưu ý:</strong> Giá trị mỗi đơn hàng tối đa <b>100.000.000đ</b>. Nếu muốn mua vượt hạn mức này, vui lòng liên hệ trực tiếp <a href="tel:19001234">19001234</a> để được hỗ trợ ký hợp đồng riêng.</li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="rights-duties-card">
                    <h5 class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Nghĩa Vụ</h5>
                    <ul class="policy-list">
                      <li>Cung cấp thông tin chính xác khi đăng ký</li>
                      <li>Thanh toán đầy đủ theo đúng quy định</li>
                      <li>Không sử dụng website cho mục đích xấu</li>
                      <li>Tuân thủ các điều khoản sử dụng</li>
                      <li>Thông báo kịp thời khi có thay đổi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h4 class="text-primary mb-3 mt-4"><i class="bi bi-x-circle me-2"></i>Hành Vi Bị Cấm</h4>
              <div class="alert alert-danger">
                <h6><i class="bi bi-exclamation-octagon me-2"></i>Các Hành Vi Nghiêm Cấm</h6>
                <ul class="policy-list mb-0">
                  <li>Sử dụng thông tin sai lệch để đăng ký tài khoản</li>
                  <li>Tấn công, hack hoặc phá hoại hệ thống</li>
                  <li>Spam, gửi nội dung không phù hợp</li>
                  <li>Sao chép, sử dụng trái phép nội dung website</li>
                  <li>Tạo tài khoản ảo để lợi dụng khuyến mãi</li>
                  <li>Chia sẻ tài khoản cho người khác sử dụng</li>
                </ul>
              </div>

              <h4 class="text-primary mb-3 mt-4"><i class="bi bi-shield-exclamation me-2"></i>Trách Nhiệm Pháp Lý</h4>
              <div class="row">
                <div class="col-12">
                  <div class="legal-section">
                    <h6 class="text-info"><i class="bi bi-building me-2"></i>BookStation Cam Kết</h6>
                    <ul class="policy-list">
                      <li>Cung cấp dịch vụ ổn định, chất lượng</li>
                      <li>Bảo mật thông tin khách hàng tuyệt đối</li>
                      <li>Xử lý khiếu nại một cách công bằng</li>
                      <li>Tuân thủ đầy đủ các quy định pháp luật</li>
                    </ul>
                    
                    <h6 class="text-warning mt-4"><i class="bi bi-exclamation-triangle me-2"></i>Giới Hạn Trách Nhiệm</h6>
                    <ul class="policy-list">
                      <li>Không chịu trách nhiệm về thiệt hại do khách hàng sử dụng sai</li>
                      <li>Không đảm bảo website hoạt động 100% thời gian</li>
                      <li>Không chịu trách nhiệm về nội dung do khách hàng tạo ra</li>
                      <li>Có quyền thay đổi điều khoản với thông báo trước</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="alert alert-primary mt-4">
                <h6><i class="bi bi-calendar-check me-2"></i>Hiệu Lực</h6>
                <p class="mb-0">
                  Điều khoản này có hiệu lực từ ngày <strong>01/01/2024</strong> và được cập nhật thường xuyên. 
                  Khách hàng vui lòng kiểm tra định kỳ để nắm được những thay đổi mới nhất.
                </p>
              </div>
            </div>
          `
        }
      ]
    }
  }
}
</script>

<style scoped>
.policies-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  opacity: 0.3;
}

.hero-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Navigation Pills */
.policy-nav {
  position: sticky;
  top: 80px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nav-pills .nav-link {
  border-radius: 25px;
  padding: 0.7rem 1.5rem;
  margin: 0 0.5rem;
  background: transparent;
  border: 2px solid transparent;
  color: #6c757d;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-pills .nav-link:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-color: rgba(220, 53, 69, 0.3);
  transform: translateY(-2px);
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #dc3545, #a71d2a);
  color: white;
  border-color: #dc3545;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  transform: translateY(-2px);
}

/* Policy Content */
.policy-content {
  animation: fadeInUp 0.6s ease;
}

.policy-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

.policy-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: none;
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.policy-card .card-header h2 {
  color: #495057;
  font-size: 1.8rem;
  font-weight: 600;
}

.policy-card .card-body {
  padding: 2rem;
  line-height: 1.7;
}

/* Policy Sections */
.policy-section h4 {
  border-bottom: 2px solid rgba(220, 53, 69, 0.2);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.policy-list {
  list-style: none;
  padding: 0;
}

.policy-list li {
  position: relative;
  padding: 0.5rem 0 0.5rem 2rem;
  margin-bottom: 0.5rem;
}

.policy-list li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #dc3545;
  font-size: 0.8rem;
}

/* Special Cards */
.voucher-type-card,
.shipping-zone,
.rights-duties-card,
.info-type-card {
  background: rgba(248, 249, 250, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.voucher-type-card:hover,
.shipping-zone:hover,
.rights-duties-card:hover,
.info-type-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Security Items */
.security-item {
  text-align: center;
  padding: 1rem;
  transition: all 0.3s ease;
}

.security-item:hover {
  transform: translateY(-5px);
}

/* Commitment Items */
.commitment-item {
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.commitment-item:hover {
  transform: translateY(-5px);
}

.commitment-item i {
  margin-bottom: 1rem;
}

/* Tables */
.table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.table thead th {
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table tbody td {
  border-color: rgba(0, 0, 0, 0.05);
  vertical-align: middle;
}

/* Alerts */
.alert {
  border: none;
  border-radius: 15px;
  border-left: 4px solid;
}

.alert-info {
  border-left-color: #17a2b8;
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.1), rgba(23, 162, 184, 0.05));
}

.alert-warning {
  border-left-color: #ffc107;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
}

.alert-success {
  border-left-color: #28a745;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.05));
}

.alert-danger {
  border-left-color: #dc3545;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
}

.alert-primary {
  border-left-color: #007bff;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
}

/* Violation Levels */
.violation-levels {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.level-card {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

.warning-level {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.suspend-level {
  background: rgba(23, 162, 184, 0.1);
  border: 1px solid rgba(23, 162, 184, 0.3);
}

.ban-level {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
}

/* Support Section */
.support-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.support-item {
  padding: 2rem 1rem;
  transition: all 0.3s ease;
}

.support-item:hover {
  transform: translateY(-10px);
}

.support-item i {
  margin-bottom: 1rem;
  display: block;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-pills .nav-link {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    margin: 0.2rem;
  }
  
  .policy-card .card-header,
  .policy-card .card-body {
    padding: 1.5rem;
  }
  
  .policy-card .card-header h2 {
    font-size: 1.5rem;
  }
  
  .violation-levels {
    flex-direction: column;
  }
  
  .hero-section h1 {
    font-size: 2.5rem !important;
  }
}

@media (max-width: 576px) {
  .policy-nav {
    position: static;
    border-radius: 15px;
  }
  
  .nav-pills {
    flex-wrap: wrap;
    justify-content: center !important;
  }
  
  .nav-pills .nav-link {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
