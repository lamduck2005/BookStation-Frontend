<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">Admin / <strong>Book</strong></h6>
    </div>
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-3">
          <label class="form-label">Tìm kiếm:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên sách hoặc mã"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Danh mục</label>
          <select class="form-select" v-model="selectedCategory">
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Nhà cung cấp</label>
          <select class="form-select" v-model="selectedSupplier">
            <option value="">Tất cả nhà cung cấp</option>
            <option v-for="sup in supplierOptions" :key="sup" :value="sup">
              {{ sup }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả trạng thái</option>
            <option value="available">Còn hàng</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
      </div>
    </div>
    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <button
        class="btn btn-primary"
        style="background-color: #33304e; border-color: #33304e"
        @click="openAddModal"
      >
        <i class="bi bi-plus-circle me-2"></i> Thêm mới
      </button>
    </div>
    <!-- Alert chú ý -->
    <div
      class="rank-warning-label d-flex align-items-center justify-content-center mb-3"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/128/3756/3756730.png"
        alt="Warning"
        class="rank-warning-icon me-2"
      />
      <span class="rank-warning-text">
        <strong>Giá trị tồn kho nhỏ hơn 5 sẽ được cảnh báo đỏ!</strong>
      </span>
    </div>
    <!-- Danh sách Book -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <strong>Danh sách Sách</strong>
      </div>
      <div class="p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Danh mục</th>
              <th>Nhà cung cấp</th>
              <th>Chương trình khuyến mãi</th>
              <!-- Thêm cột mới -->
              <th>Ngày phát hành</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th style="width: 120px">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(book, idx) in pagedBooks" :key="book.id">
              <td>{{ book.id }}</td>
              <td>{{ book.book_code }}</td>
              <td>{{ book.book_name }}</td>
              <td>
                <span v-if="Array.isArray(book.author_name)">
                  <span v-for="(author, i) in book.author_name" :key="i">
                    {{ author
                    }}<span v-if="i < book.author_name.length - 1">, </span>
                  </span>
                </span>
                <span v-else>{{ book.author_name }}</span>
              </td>
              <td>{{ formatCurrency(book.price) }}</td>
              <td>
                <span
                  :class="{ 'text-danger fw-bold': book.stock_quantity < 5 }"
                >
                  {{ book.stock_quantity }}
                </span>
              </td>
              <td>
                <span
                  :class="[
                    'badge',
                    book.stock_quantity > 0
                      ? 'bg-success-subtle text-success'
                      : 'bg-danger-subtle text-danger',
                  ]"
                >
                  {{ book.stock_quantity > 0 ? "Còn hàng" : "Hết hàng" }}
                </span>
              </td>
              <td>{{ book.category_name }}</td>
              <td>{{ book.supplier_name }}</td>
              <td>
                <span v-if="book.flash_sale_name">{{
                  book.flash_sale_name
                }}</span>
                <span v-else class="text-muted">Không áp dụng</span>
              </td>
              <td>{{ formatDate(book.publication_date) }}</td>
              <td>{{ formatDate(book.created_at) }}</td>
              <td>{{ formatDate(book.updated_at) }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary me-1"
                  @click="openEditModal(book)"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(book)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="pagedBooks.length === 0">
              <td colspan="14" class="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <Pagination
          :page-number="currentPage"
          :total-pages="totalPages"
          :is-last-page="isLastPage"
          :page-size="pageSize"
          :items-per-page-options="itemsPerPageOptions"
          :total-elements="filteredBooks.length"
          @prev="handlePrev"
          @next="handleNext"
          @update:pageSize="handlePageSizeChange"
        />
      </div>
    </div>
    <!-- Modal Add/Edit Book -->
    <div
      class="modal fade"
      id="bookModal"
      tabindex="-1"
      aria-labelledby="bookModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="background-color: #ecae9e">
            <h5 class="modal-title" id="bookModalLabel">
              <i
                class="bi me-2"
                :class="isEditMode ? 'bi-pencil' : 'bi-plus-circle'"
              ></i>
              {{ isEditMode ? "Sửa Sách" : "Thêm Sách" }}
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/694/694604.png"
                alt="Close"
              />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmitBook">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label"
                    >Mã sách <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="newBook.book_code"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Tên sách <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="newBook.book_name"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Tác giả <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    class="form-control"
                    v-model="authorInput"
                    placeholder="Nhập tên tác giả, cách nhau bởi dấu phẩy"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Giá <span class="text-danger">*</span></label
                  >
                  <input
                    type="number"
                    class="form-control"
                    v-model="newBook.price"
                    min="0"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Tồn kho <span class="text-danger">*</span></label
                  >
                  <input
                    type="number"
                    class="form-control"
                    v-model="newBook.stock_quantity"
                    min="0"
                    required
                  />
                </div>
                <div class="col-12">
                  <label class="form-label">Trạng thái</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="
                      Number(newBook.stock_quantity) > 0
                        ? 'Còn hàng'
                        : 'Hết hàng'
                    "
                    disabled
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Danh mục <span class="text-danger">*</span></label
                  >
                  <select
                    class="form-select"
                    v-model="newBook.category_name"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option
                      v-for="cat in categoryOptions"
                      :key="cat"
                      :value="cat"
                    >
                      {{ cat }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label"
                    >Nhà cung cấp <span class="text-danger">*</span></label
                  >
                  <select
                    class="form-select"
                    v-model="newBook.supplier_name"
                    required
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    <option
                      v-for="sup in supplierOptions"
                      :key="sup"
                      :value="sup"
                    >
                      {{ sup }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Chương trình khuyến mãi</label>
                  <select class="form-select" v-model="newBook.flash_sale_name">
                    <option value="">Không áp dụng</option>
                    <option
                      v-for="fs in flashSales"
                      :key="fs.id"
                      :value="fs.name"
                    >
                      {{ fs.name }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Ngày phát hành</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="newBook.publication_date"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSubmitBook"
              style="background-color: #33304e; border-color: #33304e"
            >
              {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Pagination from "@/components/common/Pagination.vue";
import { ref, computed, watch } from "vue";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";

// Dữ liệu chương trình khuyến mãi mẫu (fix cứng)
const flashSales = [
  {
    id: 1,
    name: "Flash Sale Tháng 6",
    startTime: 1717200000000,
    endTime: 1717804800000,
    status: 1,
  },
  {
    id: 2,
    name: "Giảm giá hè 2024",
    startTime: 1718000000000,
    endTime: 1718604800000,
    status: 1,
  },
  {
    id: 3,
    name: "Back To School",
    startTime: 1719000000000,
    endTime: 1719604800000,
    status: 0,
  },
];

const books = ref([
  {
    id: 1,
    book_code: "BS1001",
    book_name: "Đắc Nhân Tâm",
    description: "Cuốn sách nổi tiếng về nghệ thuật giao tiếp và ứng xử.",
    price: 120000,
    discount_price: 90000,
    stock_quantity: 50,
    publication_date: "2022-01-15",
    created_at: "2024-05-15",
    updated_at: "2024-06-10",
    category_name: "Kỹ năng sống",
    supplier_name: "NXB Trẻ",
    author_name: ["Dale Carnegie"],
    average_rating: 4.5,
    review_count: 120,
    user_reviews: [
      {
        user_name: "Nguyễn Văn An",
        created_at: "2024-06-01 10:00:00",
        content: "Sách rất hay và ý nghĩa.",
      },
      {
        user_name: "Trần Thị Thảo",
        created_at: "2024-06-02 14:30:00",
        content: "Nội dung dễ hiểu, thực tế.",
      },
    ],
    total_sold: 300,
    flash_sale_name: flashSales[0].name, // Áp dụng Flash Sale Tháng 6
  },
  {
    id: 2,
    book_code: "BS1002",
    book_name: "Nhà Giả Kim",
    description: "Hành trình phiêu lưu kỳ diệu của chàng trai Santiago.",
    price: 95000,
    discount_price: null,
    stock_quantity: 3,
    publication_date: "2021-08-10",
    created_at: "2024-04-20",
    updated_at: "2024-06-08",
    category_name: "Văn học",
    supplier_name: "NXB Văn Học",
    author_name: ["Paulo Coelho"],
    average_rating: 4.7,
    review_count: 98,
    user_reviews: [
      {
        user_name: "Lê Minh Tuấn",
        created_at: "2024-06-03 09:20:00",
        content: "Câu chuyện truyền cảm hứng.",
      },
    ],
    total_sold: 210,
    flash_sale_name: flashSales[1].name, // Áp dụng Giảm giá hè 2024
  },
  {
    id: 3,
    book_code: "BS1003",
    book_name: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    description: "Cuốn sách truyền cảm hứng cho giới trẻ Việt Nam.",
    price: 85000,
    discount_price: null,
    stock_quantity: 0,
    publication_date: "2020-05-20",
    created_at: "2024-03-10",
    updated_at: "2024-05-30",
    category_name: "Kỹ năng sống",
    supplier_name: "NXB Trẻ",
    author_name: ["Rosie Nguyễn"],
    average_rating: 4.6,
    review_count: 77,
    user_reviews: [
      {
        user_name: "Phạm Thanh Hoa",
        created_at: "2024-06-04 11:00:00",
        content: "Rất phù hợp cho các bạn trẻ.",
      },
    ],
    total_sold: 150,
    flash_sale_name: "", // Không áp dụng
  },
  {
    id: 4,
    book_code: "BS1004",
    book_name: "Dế Mèn Phiêu Lưu Ký",
    description: "Tác phẩm thiếu nhi nổi tiếng của Tô Hoài.",
    price: 60000,
    discount_price: null,
    stock_quantity: 12,
    publication_date: "2019-03-15",
    created_at: "2024-02-01",
    updated_at: "2024-04-15",
    category_name: "Thiếu nhi",
    supplier_name: "NXB Kim Đồng",
    author_name: ["Tô Hoài"],
    average_rating: 4.8,
    review_count: 55,
    user_reviews: [],
    total_sold: 90,
    flash_sale_name: flashSales[2].name, // Áp dụng Back To School
  },
  {
    id: 5,
    book_code: "BS1005",
    book_name: "Harry Potter và Hòn Đá Phù Thủy",
    description: "Tập đầu tiên trong loạt truyện Harry Potter.",
    price: 180000,
    discount_price: 150000,
    stock_quantity: 7,
    publication_date: "2003-07-21",
    created_at: "2024-01-15",
    updated_at: "2024-03-10",
    category_name: "Giả tưởng",
    supplier_name: "NXB Trẻ",
    author_name: ["J.K. Rowling"],
    average_rating: 4.9,
    review_count: 200,
    user_reviews: [],
    total_sold: 500,
    flash_sale_name: flashSales[0].name, // Áp dụng Flash Sale Tháng 6
  },
  {
    id: 6,
    book_code: "BS1006",
    book_name: "Sapiens: Lược Sử Loài Người",
    description: "Khám phá lịch sử phát triển của loài người.",
    price: 210000,
    discount_price: 180000,
    stock_quantity: 2,
    publication_date: "2018-11-10",
    created_at: "2024-06-01",
    updated_at: "2024-06-09",
    category_name: "Lịch sử",
    supplier_name: "NXB Thế Giới",
    author_name: ["Yuval Noah Harari"],
    average_rating: 4.8,
    review_count: 180,
    user_reviews: [],
    total_sold: 320,
    flash_sale_name: "", // Không áp dụng
  },
  {
    id: 7,
    book_code: "BS1007",
    book_name: "Bố Già",
    description: "Tiểu thuyết nổi tiếng về thế giới mafia.",
    price: 135000,
    discount_price: null,
    stock_quantity: 10,
    publication_date: "2015-09-01",
    created_at: "2024-05-01",
    updated_at: "2024-06-07",
    category_name: "Văn học",
    supplier_name: "NXB Văn Học",
    author_name: ["Mario Puzo"],
    average_rating: 4.7,
    review_count: 110,
    user_reviews: [],
    total_sold: 210,
    flash_sale_name: flashSales[1].name, // Áp dụng Giảm giá hè 2024
  },
  {
    id: 8,
    book_code: "BS1008",
    book_name: "Combo: Lược Sử Thời Gian & Vũ Trụ Trong Vỏ Hạt Dẻ",
    description: "Hai tác phẩm nổi tiếng về vật lý vũ trụ.",
    price: 250000,
    discount_price: 220000,
    stock_quantity: 5,
    publication_date: "2017-04-20",
    created_at: "2024-04-01",
    updated_at: "2024-06-05",
    category_name: "Khoa học",
    supplier_name: "NXB Trẻ",
    author_name: ["Stephen Hawking", "Trần Tiễn Cao Đăng (dịch)"],
    average_rating: 4.9,
    review_count: 95,
    user_reviews: [],
    total_sold: 180,
    flash_sale_name: "", // Không áp dụng
  },
]);

const searchQuery = ref("");
const selectedCategory = ref("");
const selectedSupplier = ref("");
const selectedStatus = ref("");
const isEditMode = ref(false);
const currentPage = ref(0);
const pageSize = ref(10);
const itemsPerPageOptions = ref([5, 10, 25, 50]);
const newBook = ref({});
const authorInput = ref("");

const categoryOptions = computed(() => {
  const set = new Set(books.value.map((b) => b.category_name));
  return Array.from(set);
});
const supplierOptions = computed(() => {
  const set = new Set(books.value.map((b) => b.supplier_name));
  return Array.from(set);
});

const filteredBooks = computed(() => {
  return books.value.filter(
    (b) =>
      (!searchQuery.value ||
        b.book_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        b.book_code?.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (!selectedCategory.value || b.category_name === selectedCategory.value) &&
      (!selectedSupplier.value || b.supplier_name === selectedSupplier.value) &&
      (!selectedStatus.value ||
        (selectedStatus.value === "available" && b.stock_quantity > 0) ||
        (selectedStatus.value === "out" && b.stock_quantity <= 0))
  );
});
const totalPages = computed(
  () => Math.ceil(filteredBooks.value.length / pageSize.value) || 1
);
const isLastPage = computed(() => currentPage.value >= totalPages.value - 1);
const pagedBooks = computed(() =>
  filteredBooks.value.slice(
    currentPage.value * pageSize.value,
    (currentPage.value + 1) * pageSize.value
  )
);

function handlePrev() {
  if (currentPage.value > 0) currentPage.value--;
}
function handleNext() {
  if (!isLastPage.value) currentPage.value++;
}
function handlePageSizeChange(newSize) {
  pageSize.value = newSize;
  currentPage.value = 0;
}

function formatCurrency(val) {
  if (!val) return "-";
  return Number(val).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
function formatDate(val) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("vi-VN");
}

function openAddModal() {
  isEditMode.value = false;
  newBook.value = {
    book_code: "",
    book_name: "",
    price: 0,
    stock_quantity: 0,
    category_name: "",
    supplier_name: "",
    publication_date: "",
    flash_sale_name: "",
    author_name: [],
  };
  authorInput.value = "";
  showBookModal();
}
function openEditModal(book) {
  isEditMode.value = true;
  newBook.value = { ...book };
  // Convert author_name array to string for input
  authorInput.value = Array.isArray(book.author_name)
    ? book.author_name.join(", ")
    : book.author_name || "";
  showBookModal();
}
function showBookModal() {
  const el = document.getElementById("bookModal");
  const modal = Modal.getOrCreateInstance(el);
  modal.show();
}
function handleSubmitBook() {
  // Validate
  if (
    !newBook.value.book_code ||
    !newBook.value.book_name ||
    !newBook.value.category_name ||
    !newBook.value.supplier_name ||
    !authorInput.value
  ) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Vui lòng nhập đủ thông tin bắt buộc!",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }
  if (isNaN(Number(newBook.value.price)) || Number(newBook.value.price) < 0) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Giá phải là số >= 0!",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }
  if (
    isNaN(Number(newBook.value.stock_quantity)) ||
    Number(newBook.value.stock_quantity) < 0
  ) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Tồn kho phải là số >= 0!",
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }
  // Parse author_name from input
  newBook.value.author_name = authorInput.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  if (isEditMode.value) {
    // Update
    const idx = books.value.findIndex((b) => b.id === newBook.value.id);
    if (idx !== -1) books.value[idx] = { ...newBook.value };
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Cập nhật thành công!",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    // Add
    newBook.value.id = Date.now();
    newBook.value.created_at = new Date();
    newBook.value.updated_at = new Date();
    books.value.unshift({ ...newBook.value });
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Thêm mới thành công!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  Modal.getOrCreateInstance(document.getElementById("bookModal")).hide();
}
function confirmDelete(book) {
  Swal.fire({
    title: "Bạn chắc chắn muốn xóa?",
    text: `Xóa sách: ${book.book_name}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      books.value = books.value.filter((b) => b.id !== book.id);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Đã xóa!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

watch(
  [searchQuery, selectedCategory, selectedSupplier, selectedStatus, pageSize],
  () => {
    currentPage.value = 0;
  }
);
</script>
<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.modal-dialog {
  max-width: 450px !important;
}
.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
}
.modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
}
.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
}
.custom-close-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}
.custom-close-btn img {
  width: 30px;
  height: 30px;
}
.rank-warning-label {
  background: #fff3cd;
  border: 1.5px solid #ffeeba;
  border-radius: 8px;
  padding: 10px 18px;
  margin-bottom: 18px;
  font-size: 1.08rem;
  color: #856404;
  font-family: "Segoe UI", "Arial", sans-serif;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.08);
}
.rank-warning-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}
.rank-warning-text {
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 1.08rem;
}
</style>
