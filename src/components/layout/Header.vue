<template>
  <header class="header-section">
    <!-- Header chính với logo, search và icons -->
    <div class="main-header bg-white shadow-sm">
      <div class="container-fluid">
        <div class="row align-items-center" style="height: 60px">
          <!-- Logo -->
          <div class="col-auto">
            <div class="logo me-4">
              <img
                src="/src/assets/img/logo.png"
                alt="Fahasa Logo"
                style="height: 55px; width: 55px"
              />
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
                      <h6 class="category-title text-danger fw-bold mb-3">
                        <i
                          :class="getCategoryIcon(category.categoryName)"
                          class="me-2"
                        ></i>
                        {{ category.categoryName.toUpperCase() }}
                      </h6>
                      <ul class="category-list list-unstyled">
                        <!-- Hiển thị danh mục con -->
                        <li
                          v-for="child in category.parentCategory"
                          :key="child.id"
                        >
                          <a
                            href="#"
                            class="category-link"
                            @click.prevent="goToCategory(child.id)"
                          >
                            {{ child.categoryName }}
                          </a>
                        </li>
                        <!-- Link xem tất cả -->
                        <li v-if="category.parentCategory.length > 0">
                          <a
                            href="#"
                            class="category-link text-primary"
                            @click.prevent="goToCategory(category.id)"
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

                <!-- Thêm một số danh mục đặc biệt nếu cần -->
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
            class="col bg-light d-flex align-items-center px-3"
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
              />
              <button class="btn btn-danger px-4" type="button">
                <i class="bi bi-search"></i>
              </button>
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
            <div
              class="d-flex flex-column align-items-center text-decoration-none text-dark position-relative"
            >
              <i class="bi bi-cart3 fs-5"></i>
              <small class="text-muted" style="font-size: 11px">Giỏ Hàng</small>
              <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style="font-size: 9px"
                >0</span
              >
            </div>

            <!-- Account -->
            <div
              class="d-flex flex-column align-items-center text-decoration-none text-dark"
            >
              <RouterLink
                to="/profile"
                class="text-dark d-flex flex-column align-items-center text-decoration-none"
              >
                <i class="bi bi-person-circle fs-5"></i>
                <small class="text-muted" style="font-size: 11px"
                  >Tài khoản</small
                >
              </RouterLink>
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
              <a class="nav-link fw-semibold text-dark" href="#">Trang chủ</a>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import NotificationComponent from "@/components/common/NotificationComponent.vue";
import { getAllCategoriesForUser } from "@/services/admin/category";

// State cho dropdown
const showCategoryMenu = ref(false);
const categories = ref([]);

// Thêm state cho search
const searchText = ref("");
const router = useRouter();

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

// Hàm lấy class cho cột dựa trên index
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

// Hàm lấy icon cho từng danh mục
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

// Hàm xử lý khi click vào danh mục
const goToCategory = (id) => {
  console.log("Navigating to category:", id);
};

// Xử lý tìm kiếm
const handleSearch = () => {
  if (searchText.value.trim()) {
    router.push({
      path: "/products",
      query: { search: searchText.value.trim() },
    });
  }
};
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
  height: 55px;
  width: 55px;
}

/* Categories dropdown styling */
.categories-dropdown {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.categories-dropdown:hover {
  background-color: #c82333 !important;
}

/* Mega menu styling */
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

/* Special sections */
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

/* Search bar styling */
.input-group input:focus {
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

.bg-light {
  background-color: #f8f9fa !important;
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

/* Badge styling */
.badge {
  font-size: 9px;
}

/* Icon spacing */
.d-flex.flex-column small {
  margin-top: 2px;
  font-size: 11px;
}
</style>
