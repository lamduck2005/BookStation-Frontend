<template>
  <header class="header-section">
    <!-- Header chính với logo, search và icons -->
    <div class="main-header bg-white shadow-sm">
      <div class="container-fluid">
        <div class="row align-items-center" style="height: 60px">
          <!-- Logo -->
          <div class="col-auto">
            <div class="logo me-4">
              <RouterLink to="/">
                <img
                  src="/src/assets/img/logo.png"
                  alt="BookStation Logo"
                  style="height: 55px; width: 55px"
                />
              </RouterLink>
            </div>
          </div>

          <!-- Categories dropdown (màu đỏ) -->
          <div
            class="col-auto bg-danger text-white d-flex align-items-center px-3 position-relative categories-dropdown"
            style="height: 60px"
            @mouseenter="showCategoryMenu = true"
            @mouseleave="showCategoryMenu = false"
          >
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-grid-3x3-gap"></i>
              <span class="fw-bold d-none d-md-inline">Danh mục sản phẩm</span>
              <i class="bi bi-chevron-down small"></i>
            </div>

            <!-- Mega menu dropdown -->
            <div
              v-show="showCategoryMenu"
              class="category-mega-menu position-absolute bg-white shadow-lg border-0"
              @mouseenter="showCategoryMenu = true"
              @mouseleave="showCategoryMenu = false"
            >
              <div class="container-fluid p-4">
                <div class="row g-4">
                  <!-- Lặp qua các danh mục chính -->
                  <div
                    v-for="(category, index) in categories"
                    :key="category.id"
                    :class="getColumnClass(index)"
                  >
                    <div class="category-section">
                      <a
                        href="#"
                        @click.prevent="goToCategory(category.id, 'parent')"
                        class="category-title-link"
                      >
                        <h6 class="category-title text-danger fw-bold mb-3">
                          <i
                            :class="getCategoryIcon(category.categoryName)"
                            class="me-2"
                          ></i>
                          {{ category.categoryName.toUpperCase() }}
                        </h6>
                      </a>
                      <ul class="category-list list-unstyled">
                        <!-- Hiển thị danh mục con -->
                        <li
                          v-for="child in category.parentCategory"
                          :key="child.id"
                        >
                          <a
                            href="#"
                            class="category-link"
                            @click.prevent="goToCategory(child.id, 'child')"
                          >
                            {{ child.categoryName }}
                          </a>
                        </li>
                        <!-- Link xem tất cả -->
                        <li v-if="category.parentCategory.length > 0">
                          <a
                            href="#"
                            class="category-link text-primary"
                            @click.prevent="goToCategory(category.id, 'parent')"
                          >
                            Xem tất cả
                          </a>
                        </li>
                        <!-- Hiển thị message nếu không có danh mục con -->
                        <li v-if="category.parentCategory.length === 0">
                          <span class="text-muted small">Đang cập nhật...</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Special categories section -->
                <div
                  class="row g-4 pt-3 border-top"
                  v-if="categories.length > 0"
                >
                  <div class="col-md-6">
                    <div class="special-section">
                      <h6 class="fw-bold text-danger mb-2">
                        <i class="bi bi-fire me-2"></i>
                        SÁCH MỚI ♥
                      </h6>
                      <div class="special-links">
                        <a href="#" class="badge bg-danger text-white me-2 mb-1"
                          >SÁCH HOT</a
                        >
                        <a href="#" class="badge bg-danger text-white me-2 mb-1"
                          >MỚI NHẤT</a
                        >
                        <a href="#" class="badge bg-danger text-white me-2 mb-1"
                          >TRENDING</a
                        >
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="special-section">
                      <h6 class="fw-bold text-danger mb-2">
                        <i class="bi bi-lightning me-2"></i>
                        KHUYẾN MÃI ♥
                      </h6>
                      <div class="special-links">
                        <a href="#" class="badge bg-warning text-dark me-2 mb-1"
                          >GIẢM GIÁ</a
                        >
                        <a href="#" class="badge bg-warning text-dark me-2 mb-1"
                          >FLASH SALE</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search bar (nền xám) -->
          <div
            class="col bg-light d-flex align-items-center px-3 position-relative"
            style="height: 60px"
          >
            <div class="input-group w-100">
              <input
                v-model="searchText"
                type="text"
                class="form-control border-0 bg-transparent"
                placeholder="Tìm kiếm sách, tác giả..."
                style="box-shadow: none"
                @keyup.enter="handleSearch"
                @focus="showSearchResults = true"
                @blur="hideSearchResults"
              />
              <button
                class="btn btn-danger px-4"
                type="button"
                @click="handleSearch"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>

            <!-- Search Results Dropdown -->
            <div
              v-if="showSearchResults && bookSearch.length > 0"
              class="search-results-dropdown position-absolute bg-white shadow-lg border"
            >
              <!-- Sản phẩm -->
              <div class="search-products p-3">
                <h6 class="text-muted mb-3">
                  <i class="bi bi-book me-2"></i>Sản phẩm
                </h6>
                <div class="product-results">
                  <div
                    v-for="book in bookSearch.slice(0, 6)"
                    :key="book.id"
                    class="product-item d-flex align-items-center p-2 rounded mb-2"
                    @click="goToProduct(book.bookId)"
                  >
                    <img
                      :src="
                        book.images?.[0] ||
                        book.imageUrl ||
                        '/placeholder-book.jpg'
                      "
                      :alt="book.bookName"
                      class="product-thumb me-3"
                    />
                    <div class="product-info flex-grow-1">
                      <div class="product-name fw-medium">
                        {{ book.bookName }}
                      </div>
                      <div class="product-price text-danger fw-bold">
                        {{ formatPrice(book.price) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Xem thêm -->
                <div
                  class="text-center pt-2 border-top"
                  v-if="bookSearch.length > 6"
                >
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="viewAllResults"
                  >
                    Xem thêm {{ bookSearch.length - 6 }} kết quả
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side icons -->
          <div
            class="col-auto d-flex align-items-center gap-3 px-3"
            style="height: 60px"
          >
            <!-- Notifications -->
            <NotificationComponent mode="dropdown" />

            <!-- Cart -->
            <RouterLink
              to="/cart"
              class="d-flex flex-column align-items-center text-decoration-none text-dark position-relative cart-link"
            >
              <i class="bi bi-cart3 fs-5"></i>
              <small class="text-muted" style="font-size: 11px">Giỏ Hàng</small>
              <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style="font-size: 9px"
                >0</span
              >
            </RouterLink>

            <!-- Account dropdown -->
            <div class="user-link position-relative">
              <div
                class="d-flex flex-column align-items-center text-decoration-none text-dark"
              >
                <div
                  class="avatar d-flex align-items-center justify-content-center"
                >
                  <i class="bi bi-person-circle fs-5"></i>
                </div>
                <small class="text-muted" style="font-size: 11px"
                  >Tài khoản</small
                >
              </div>

              <!-- User dropdown menu -->
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
            <div class="d-flex align-items-center">
              <img
                src="https://flagcdn.com/16x12/vn.png"
                alt="VN"
                class="me-1"
              />
              <i class="bi bi-chevron-down small"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation menu dưới -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-top">
      <div class="container-fluid px-3">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link fw-semibold text-dark" to="/"
                >Trang chủ</RouterLink
              >
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#Trend"
                >Xu hướng mua sẵm -Sách hot</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#category-client">Danh mục</a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#flashsale-product"
                >Flash Sale</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="#">Khuyến mãi</a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3">
            <small class="text-muted">
              <i class="bi bi-telephone me-1"></i>
              0123456789
            </small>
            <small class="text-muted">
              <i class="bi bi-envelope me-1"></i>
              cskh@bookstation.com
            </small>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import NotificationComponent from "@/components/common/NotificationComponent.vue";
import { getAllCategoriesForUser } from "@/services/admin/category";
import { fetchBookSearch } from "@/services/admin/book"; // ✅ Import đúng
import { showQuickConfirm, showToast } from "@/utils/swalHelper";
import { clearAuth } from "@/utils/utils";

// Router instance
const router = useRouter();

// State management
const showCategoryMenu = ref(false);
const categories = ref([]);
const searchText = ref("");
const bookSearch = ref([]);
const showSearchResults = ref(false);

// ✅ Sửa lại hàm fetchBookSearch (đổi tên để tránh conflict)
const searchBooks = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") {
    bookSearch.value = [];
    return;
  }

  try {
    const response = await fetchBookSearch(searchTerm.trim());
    console.log("Kết quả tìm kiếm:", response);
    bookSearch.value = response || [];
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sách:", error);
    bookSearch.value = [];
  }
};

// ✅ Watch để theo dõi searchText
watch(
  searchText,
  (newValue) => {
    // Debounce: chờ 500ms sau khi user ngừng gõ mới search
    clearTimeout(searchBooks.timeoutId);
    searchBooks.timeoutId = setTimeout(() => {
      searchBooks(newValue);
    }, 500);
  },
  { immediate: false }
);

// Lifecycle hook
onMounted(() => {
  fetchCategory();
});
const fetchCategory = async () => {
  try {
    const response = await getAllCategoriesForUser();
    const data = response.data ? response.data : response;
    categories.value = data.content || data;
    console.log("Danh sách danh mục sau khi xử lý:", categories.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách danh mục:", error);
  }
};

const getColumnClass = (index) => {
  const totalCategories = categories.value.length;
  if (totalCategories <= 4) {
    return "col-md-3";
  } else if (totalCategories <= 6) {
    return "col-md-2";
  } else {
    return "col-md-2";
  }
};

const getCategoryIcon = (categoryName) => {
  const iconMap = {
    "Tiểu thuyết": "bi bi-book",
    "Phi tiểu thuyết": "bi bi-journal",
    "Giáo dục": "bi bi-mortarboard",
    "Thiếu nhi": "bi bi-balloon",
    "Kinh doanh": "bi bi-graph-up",
    "Văn học": "bi bi-book",
    "Khoa học": "bi bi-atom",
    "Lịch sử": "bi bi-clock-history",
    "Tâm lý": "bi bi-heart",
    "Kỹ năng": "bi bi-person-check",
  };

  // Tìm icon phù hợp hoặc dùng icon mặc định
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return "bi bi-bookmark";
};

// Event Handlers
const goToCategory = (id, type) => {
  showCategoryMenu.value = false;
  const query = {};

  if (type === "parent") {
    // Mã hóa ID cha bằng Base64
    query.mainCategory = btoa(id.toString());
  } else if (type === "child") {
    // Mã hóa ID con bằng Base64
    query.subCategory = btoa(id.toString());

    const parent = categories.value.find((cat) =>
      cat.parentCategory.some((child) => child.id === id)
    );
    if (parent) {
      // Mã hóa ID cha bằng Base64
      query.mainCategory = btoa(parent.id.toString());
    }
  }

  router.push({
    path: "/products",
    query: query,
  });
};

const handleSearch = () => {
  const searchTerm = searchText.value.trim();
  router.push({
    path: "/products",
    // Mã hóa cả từ khóa tìm kiếm
    query: { search: searchTerm ? btoa(encodeURIComponent(searchTerm)) : "" },
  });
};

const handleLogout = async () => {
  const result = await showQuickConfirm(
    "Xác nhận đăng xuất",
    "Bạn có chắc chắn muốn đăng xuất không?"
  );
  if (result.isConfirmed) {
    showToast("success", "Đăng xuất thành công");
    clearAuth();
    router.push("/auth");
  }
};

const hideSearchResults = () => {
  // 200ms delay to allow click event to register
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

const selectSuggestion = (suggestion) => {
  searchText.value = suggestion;
  handleSearch();
};

const viewAllResults = () => {
  showSearchResults.value = false;
  router.push({
    path: "/products",
    query: { search: btoa(encodeURIComponent(searchText.value.trim())) },
  });
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  })
    .format(price || 0)
    .replace("₫", "đ");
};

const goToProduct = (productId) => {
    console.log("Navigating to product:", productId); // ✅ Debug

  showSearchResults.value = false;
  router.push({
    name: "product-detail",
    params: { id: productId },
  });
};
</script>

<style scoped>
/* ========== HEADER MAIN STYLING ========== */
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
  height: 55px;
  width: 55px;
}

.logo a {
  display: block;
  text-decoration: none;
}

/* ========== CATEGORIES DROPDOWN STYLING ========== */
.categories-dropdown {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.categories-dropdown:hover {
  background-color: #c82333 !important;
}

/* ========== MEGA MENU STYLING ========== */
.category-mega-menu {
  top: 100%;
  left: 0;
  right: 0;
  width: 100vw;
  max-width: 1200px;
  z-index: 1050;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: fadeInDown 0.3s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-section {
  padding: 0.5rem 0;
}

.category-title {
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8f9fa;
  transition: color 0.2s ease; /* Thêm hiệu ứng chuyển màu */
}

.category-title-link {
  text-decoration: none; /* Bỏ gạch chân của link */
}

.category-title-link:hover .category-title {
  color: #a71d2a !important; /* Đổi màu khi di chuột qua */
}

.category-list {
  margin: 0;
  padding: 0;
}

.category-list li {
  margin-bottom: 0.5rem;
}

.category-link {
  color: #6c757d;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: block;
  padding: 0.25rem 0;
  line-height: 1.4;
}

.category-link:hover {
  color: #dc3545;
  padding-left: 0.5rem;
  transform: translateX(2px);
}

.category-link.text-primary {
  color: #007bff !important;
  font-weight: 500;
}

.category-link.text-primary:hover {
  color: #0056b3 !important;
}

/* ========== SPECIAL SECTIONS ========== */
.special-section {
  padding: 0.5rem 0;
}

.special-links .badge {
  font-size: 0.7rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.special-links .badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ========== SEARCH BAR STYLING ========== */
.input-group input:focus {
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* ========== USER ACCOUNT DROPDOWN ========== */
.user-link {
  position: relative;
  display: inline-block;
  z-index: 1000;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  transition: all 0.2s;
}

.user-link-dropdown {
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  min-width: 180px;
  z-index: 1000;
  padding: 10px 0;
  animation: fadeIn 0.2s;
}

.user-link:hover .user-link-dropdown {
  display: block;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.18s;
  cursor: pointer;
}

.user-dropdown i {
  margin-right: 10px;
  font-size: 1.1rem;
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
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== CART LINK STYLING ========== */
.cart-link:hover {
  color: #dc3545 !important;
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

.cart-link:hover i,
.cart-link:hover small {
  color: #dc3545 !important;
}

/* ========== NAVIGATION STYLING ========== */
.navbar-nav .nav-link {
  font-weight: 500;
  color: #495057 !important;
  transition: color 0.3s ease;
  padding: 0.75rem 1rem !important;
}

.navbar-nav .nav-link:hover {
  color: #dc3545 !important;
}

.nav-link.router-link-active {
  color: #dc3545 !important;
  font-weight: bold;
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .categories-dropdown {
    display: none !important;
  }

  .category-mega-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: 100%;
    max-width: none;
  }

  .d-none.d-md-inline {
    display: none !important;
  }
}

/* ========== UTILITY STYLING ========== */
.badge {
  font-size: 9px;
}

.d-flex.flex-column small {
  margin-top: 2px;
  font-size: 11px;
}

/* ========== SEARCH RESULTS DROPDOWN STYLING ========== */
.search-results-dropdown {
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1050;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  animation: fadeInDown 0.2s ease-out;
}

.product-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 4px;
  min-height: 60px; /* Đặt chiều cao tối thiểu */
}

.product-item:hover {
  background-color: #f8f9fa;
}

.product-thumb {
  width: 45px;
  height: 55px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0; /* Không cho ảnh co lại */
}

.product-info {
  min-width: 0; /* Cho phép text wrap */
  overflow: hidden;
}

.product-name {
  font-size: 0.9rem;
  line-height: 1.3;
  margin-bottom: 4px;
  max-height: 2.6em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

.product-price {
  font-size: 0.85rem;
  white-space: nowrap;
}
</style>
