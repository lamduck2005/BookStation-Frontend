<template>
  <div class="catalog-wrapper">
    <div class="container-fluid py-3">
      <div class="row">
        <!-- Sidebar Filter -->
        <div class="col-lg-3 col-md-4">
          <!-- Truyền filterParams xuống làm giá trị khởi tạo -->
          <FiterProduct
            @filter-change="onFilterChange"
            :initial-filters="filterParams"
          />
        </div>

        <!-- Main Content -->
        <div class="col-lg-9 col-md-8">
          <!-- ... existing header code ... -->

          <!-- Product Grid -->
          <ProductGrid :products="products" :loading="loading" />

          <!-- Pagination -->
          <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage - 1)"
                  >&laquo;</a
                >
              </li>
              <li
                v-for="page in pages"
                :key="page"
                class="page-item"
                :class="{
                  active: page === currentPage,
                  disabled: page === '...',
                }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(page)"
                  >{{ page }}</a
                >
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="changePage(currentPage + 1)"
                  >&raquo;</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FiterProduct from "./ProductCatalog/FiterProduct.vue";
import ProductGrid from "./ProductCatalog/ProductGrid.vue";
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getBooksClient } from "@/services/admin/book.js";

// --- THÊM CÁC HÀM GIẢI MÃ AN TOÀN ---
const safeDecode = (str) => {
  try {
    return str ? atob(str) : null;
  } catch (e) {
    return null; // Trả về null nếu chuỗi không hợp lệ
  }
};

const safeDecodeSearch = (str) => {
  try {
    return str ? decodeURIComponent(atob(str)) : undefined;
  } catch (e) {
    return undefined;
  }
};
// --- KẾT THÚC THÊM ---

const route = useRoute();

// State
const products = ref([]);
const loading = ref(false);
const sortBy = ref("newest");

// Pagination State (dùng cho UI, 1-based)
const currentPage = ref(1);
const totalItems = ref(0); // Tổng số sản phẩm từ API

// Filter State (đối tượng gửi đi cho API)
const filterParams = reactive({
  // Sử dụng hàm giải mã
  search: safeDecodeSearch(route.query.search),
  mainCategory: route.query.mainCategory
    ? parseInt(safeDecode(route.query.mainCategory))
    : null,
  subCategories: route.query.subCategory
    ? [parseInt(safeDecode(route.query.subCategory))]
    : [],
  publisherId: null,
  minPrice: null,
  maxPrice: null,
  page: 0,
  size: 12,
});

const totalPages = computed(() => {
  if (!filterParams.size) return 0;
  return Math.ceil(totalItems.value / filterParams.size);
});

// Hàm gọi API
const fetchProducts = async () => {
  loading.value = true;
  try {
    console.log(filterParams.search);
    // 2. Tạo params gửi đi, loại bỏ các giá trị null/undefined
    const params = {
      page: filterParams.page,
      size: filterParams.size,
      bookName: filterParams.search,
      parentCategoryId: filterParams.mainCategory,
      categoryId:
        filterParams.subCategories.length > 0
          ? filterParams.subCategories[0]
          : undefined,
      publisherId: filterParams.publisherId, // <-- SỬA LẠI DÒNG NÀY
      minPrice: filterParams.minPrice,
      maxPrice:
        filterParams.maxPrice === Infinity ? undefined : filterParams.maxPrice,
      sort: sortBy.value,
    };
    console.log("Params gửi đi:", params);
    // Lọc ra các key có giá trị (không phải null/undefined)
    const validParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});
    console.log("Params hợp lệ:", validParams);
    // 3. Gọi API với các tham số hợp lệ
    const response = await getBooksClient(validParams);

    // 4. Cập nhật state với dữ liệu từ API
    if (response) {
      console.log("Dữ liệu sản phẩm:", response);
      products.value = response.content;
      totalItems.value = response.totalElements;
    } else {
      products.value = [];
      totalItems.value = 0;
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách sản phẩm:", error);
    products.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

// Xử lý khi bộ lọc thay đổi
const onFilterChange = (filters) => {
  console.log("======= BỘ LỌC THAY ĐỔI =======", filters);

  filterParams.mainCategory = filters.mainCategory;
  filterParams.subCategories = filters.subCategories;
  filterParams.publisherId = filters.publisherId; // <-- SỬA LẠI DÒNG NÀY
  filterParams.minPrice = filters.customPriceRange.min;
  filterParams.maxPrice = filters.customPriceRange.max;

  // Reset về trang đầu tiên (page 0)
  filterParams.page = 0;
  currentPage.value = 1; // Cập nhật UI về trang 1

  fetchProducts();
};

// Xử lý khi đổi trang
const changePage = (page) => {
  if (
    page < 1 ||
    page > totalPages.value ||
    page === "..." ||
    page === currentPage.value
  ) {
    return;
  }
  currentPage.value = page;
  filterParams.page = page - 1; // Cập nhật page (0-based) cho API
  fetchProducts();
};

// Computed property để tạo danh sách trang cho pagination
const pages = computed(() => {
  const range = [];
  const delta = 2;
  const left = currentPage.value - delta;
  const right = currentPage.value + delta + 1;
  let l;

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= left && i < right)) {
      range.push(i);
    }
  }

  const result = [];
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        result.push(l + 1);
      } else if (i - l > 2) {
        result.push("...");
      }
    }
    result.push(i);
    l = i;
  }
  return result;
});

// Theo dõi khi sắp xếp thay đổi
watch(sortBy, () => {
  filterParams.page = 0;
  currentPage.value = 1;
  fetchProducts();
});

// Lấy dữ liệu lần đầu
onMounted(() => {
  fetchProducts();
});

// THÊM ĐOẠN WATCH NÀY để xử lý khi người dùng click qua lại giữa các danh mục
watch(
  () => route.query,
  (newQuery) => {
    // Sử dụng hàm giải mã
    filterParams.mainCategory = newQuery.mainCategory
      ? parseInt(safeDecode(newQuery.mainCategory))
      : null;
    filterParams.subCategories = newQuery.subCategory
      ? [parseInt(safeDecode(newQuery.subCategory))]
      : [];
    filterParams.search = safeDecodeSearch(newQuery.search);

    // Reset về trang 1 và fetch lại dữ liệu
    filterParams.page = 0;
    currentPage.value = 1;
    fetchProducts();
  },
  { deep: true }
);
</script>

<style scoped>
.catalog-wrapper {
  background: #f5f7fa;
  min-height: 100vh;
}
.filter-title-main {
  border-bottom: 2px solid #dc3545;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}
.catalog-header {
  background: #f5f7fa;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.catalog-header select {
  min-width: 120px;
}
.pagination .page-item.active .page-link {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}
.pagination .page-link {
  color: #dc3545;
}
.pagination .page-item.disabled .page-link {
  color: #6c757d;
}
@media (max-width: 991.98px) {
  .filter-title-main {
    margin-top: 1rem;
  }
}
</style>
