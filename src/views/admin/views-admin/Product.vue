<template>
  <div style="padding: 32px">
    <div class="mb-3">
      <h6 class="text-muted">Quản lý / <strong>Sách</strong></h6>
    </div>

    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-4">
          <label class="form-label">Tên sách:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên sách"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Danh mục</label>
          <select class="form-select" v-model="selectedCategory">
            <option value="">Tất cả danh mục</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Nhà cung cấp</label>
          <select class="form-select" v-model="selectedSupplier">
            <option value="">Tất cả nhà cung cấp</option>
            <option v-for="sup in supplierOptions" :key="sup" :value="sup">
              {{ sup }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-between mt-5 mb-3">
      <h2 class="table-title m-0">Danh sách sách</h2>
      <button class="custom-add-btn">
        <i class="bi bi-plus-circle me-2"></i> <span>Thêm mới</span>
      </button>
    </div>
    <div class="dashboard-container">
      <div class="dashboard-table">
        <table id="main-table" class="display">
          <thead>
            <tr class="text-center">
              <th>ID</th>
              <th>Tên sách</th>
              <th>Giá gốc</th>
              <th>Giá giảm</th>
              <th>Tồn kho</th>
              <th>Ngày phát hành</th>
              <th>Danh mục</th>
              <th>Nhà cung cấp</th>
              <th>Tác giả</th>
              <th>Trung bình đánh giá</th>
              <th>Số lượt đánh giá</th>
              <th>Đã bán</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="(book, index) in filteredBooks" :key="index">
              <td>{{ book.id }}</td>
              <td>{{ book.book_name }}</td>
              <td>{{ formatCurrency(book.price) }}</td>
              <td>
                <span v-if="book.discount_price">{{
                  formatCurrency(book.discount_price)
                }}</span>
                <span v-else>-</span>
              </td>
              <td>{{ book.stock_quantity }}</td>
              <td>{{ formatDate(book.publication_date) }}</td>
              <td>{{ book.category_name }}</td>
              <td>{{ book.supplier_name }}</td>
              <td>
                <ul class="mb-0 ps-3" style="text-align: left">
                  <li v-for="author in book.author_name" :key="author">
                    {{ author }}
                  </li>
                </ul>
              </td>
              <td>
                <span v-if="book.average_rating">{{
                  book.average_rating.toFixed(1)
                }}</span>
                <span v-else>-</span>
              </td>
              <td>{{ book.review_count }}</td>
              <td>{{ book.total_sold }}</td>
              <td class="action-cell">
                <a
                  class="btn btn-custom tooltip-custom"
                  data-tooltip="Chi tiết"
                  @click="viewBookDetail(book)"
                >
                  <i class="bi bi-info-circle fs-5"></i>
                </a>
                <!-- ...thêm các chức năng khác nếu cần... -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
      :page-number="0"
      :total-pages="1"
      :is-last-page="true"
      :page-size="10"
      :items-per-page-options="[10, 20, 50, 100]"
      :total-elements="books.length"
    />

    <!-- Modal Chi Tiết Sách -->
    <div
      class="modal-overlay"
      v-if="showDetailModal"
      @click="closeDetailModalOnOutsideClick"
    >
      <div class="modal-detail modal-detail-wide" @click.stop>
        <div class="modal-header">
          <h5>Chi tiết sách</h5>
          <i class="bi bi-x-lg close-icon" @click="showDetailModal = false"></i>
        </div>
        <div class="modal-body-detail modal-body-detail-grid">
          <div class="detail-field">
            <label class="form-label">Tên sách</label>
            <input
              type="text"
              class="form-control"
              :value="selectedBook.book_name"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Mô tả chi tiết</label>
            <textarea
              class="form-control"
              :value="selectedBook.description"
              readonly
              rows="3"
            ></textarea>
          </div>
          <div class="detail-field">
            <label class="form-label">Giá gốc</label>
            <input
              type="text"
              class="form-control"
              :value="formatCurrency(selectedBook.price)"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Giá giảm</label>
            <input
              type="text"
              class="form-control"
              :value="
                selectedBook.discount_price
                  ? formatCurrency(selectedBook.discount_price)
                  : '-'
              "
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Tồn kho</label>
            <input
              type="text"
              class="form-control"
              :value="selectedBook.stock_quantity"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày phát hành</label>
            <input
              type="text"
              class="form-control"
              :value="formatDate(selectedBook.publication_date)"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Danh mục</label>
            <input
              type="text"
              class="form-control"
              :value="selectedBook.category_name"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Nhà cung cấp</label>
            <input
              type="text"
              class="form-control"
              :value="selectedBook.supplier_name"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Tác giả</label>
            <ul class="mb-0 ps-3" style="text-align: left">
              <li v-for="author in selectedBook.author_name" :key="author">
                {{ author }}
              </li>
            </ul>
          </div>
          <div class="detail-field">
            <label class="form-label">Trung bình đánh giá</label>
            <input
              type="text"
              class="form-control"
              :value="
                selectedBook.average_rating
                  ? selectedBook.average_rating.toFixed(1)
                  : '-'
              "
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Số lượt đánh giá</label>
            <input
              type="text"
              class="form-control"
              :value="selectedBook.review_count"
              readonly
            />
          </div>
          <div class="detail-field">
            <label class="form-label">Tổng đã bán</label>
            <input
              type="text"
              class="form-control"
              :value="selectedBook.total_sold"
              readonly
            />
          </div>
        </div>
        <div class="modal-body-detail">
          <h6>Danh sách đánh giá</h6>
          <div
            v-if="selectedBook.user_reviews && selectedBook.user_reviews.length"
          >
            <div
              v-for="(review, idx) in selectedBook.user_reviews"
              :key="idx"
              class="border rounded p-2 mb-2"
            >
              <div class="fw-bold">{{ review.user_name }}</div>
              <div class="text-muted" style="font-size: 0.9em">
                {{ formatDateTime(review.created_at) }}
              </div>
              <div>{{ review.content }}</div>
            </div>
          </div>
          <div v-else>
            <em>Chưa có đánh giá nào.</em>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="showDetailModal = false"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Pagination from "@/components/common/Pagination.vue";
import { ref, computed } from "vue";

const searchQuery = ref("");
const selectedCategory = ref("");
const selectedSupplier = ref("");
const showDetailModal = ref(false);
const selectedBook = ref({});

const books = ref([
  {
    id: 1,
    book_name: "Đắc Nhân Tâm",
    description: "Cuốn sách nổi tiếng về nghệ thuật giao tiếp và ứng xử.",
    price: 120000,
    discount_price: 90000,
    stock_quantity: 50,
    publication_date: "2022-01-15",
    category_name: "Kỹ năng sống",
    supplier_name: "NXB Trẻ",
    author_name: ["Dale Carnegie"],
    average_rating: 4.5,
    review_count: 120,
    user_reviews: [
      {
        user_name: "Nguyễn Văn A",
        created_at: "2024-06-01 10:00:00",
        content: "Sách rất hay và ý nghĩa.",
      },
      {
        user_name: "Trần Thị B",
        created_at: "2024-06-02 14:30:00",
        content: "Nội dung dễ hiểu, thực tế.",
      },
    ],
    total_sold: 300,
  },
  {
    id: 2,
    book_name: "Nhà Giả Kim",
    description: "Hành trình phiêu lưu kỳ diệu của chàng trai Santiago.",
    price: 95000,
    discount_price: null,
    stock_quantity: 30,
    publication_date: "2021-08-10",
    category_name: "Văn học",
    supplier_name: "NXB Văn Học",
    author_name: ["Paulo Coelho"],
    average_rating: 4.7,
    review_count: 98,
    user_reviews: [
      {
        user_name: "Lê Văn C",
        created_at: "2024-06-03 09:20:00",
        content: "Câu chuyện truyền cảm hứng.",
      },
    ],
    total_sold: 210,
  },
  {
    id: 3,
    book_name: "Nhà Giả Kim 2",
    description: "Hành trình phiêu lưu kỳ diệu của chàng trai Santiago.",
    price: 95000,
    discount_price: null,
    stock_quantity: 30,
    publication_date: "2021-08-10",
    category_name: "Văn học",
    supplier_name: "NXB Văn Học",
    author_name: ["Paulo Coelho", "Paulo Coelho 2"],
    average_rating: 4.7,
    review_count: 98,
    user_reviews: [
      {
        user_name: "Lê Văn C",
        created_at: "2024-06-03 09:20:00",
        content: "Câu chuyện truyền cảm hứng.",
      },
    ],
    total_sold: 210,
  },
  // ...thêm dữ liệu mẫu khác nếu cần...
]);

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
        b.book_name.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (!selectedCategory.value || b.category_name === selectedCategory.value) &&
      (!selectedSupplier.value || b.supplier_name === selectedSupplier.value)
  );
});

function formatCurrency(val) {
  if (!val) return "-";
  return val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("vi-VN");
}
function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleString("vi-VN");
}

function viewBookDetail(book) {
  selectedBook.value = book;
  showDetailModal.value = true;
}
function closeDetailModalOnOutsideClick(event) {
  if (event.target.classList.contains("modal-overlay")) {
    showDetailModal.value = false;
  }
}
</script>

<style>
.custom-add-btn {
  background-color: #196f3d;
  color: #fff;
  font-weight: bold;
  border: none;
  height: 50px;
  padding: 0 20px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}
.custom-add-btn:hover {
  background-color: #2ecc71;
  color: white;
}
.action-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  margin-right: 0;
}
.tooltip-custom {
  position: relative;
  cursor: pointer;
}
.tooltip-custom::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 100;
}
.tooltip-custom::before {
  content: "";
  position: absolute;
  bottom: 115%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.tooltip-custom:hover::after,
.tooltip-custom:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}
.btn-custom {
  background-color: #ebebeb;
}
.table-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ff2727;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-detail {
  background-color: white;
  border-radius: 8px;
  width: 700px;
  max-width: 98vw;
  max-height: 90vh;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.modal-body-detail {
  padding: 1.5rem;
  max-height: 65vh;
  overflow-y: auto;
}
.modal-detail-wide {
  width: 900px;
}
.modal-body-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  padding: 2rem;
}
.detail-field {
  display: flex;
  flex-direction: column;
}
.close-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}
.modal-header h5 {
  margin: 0;
  font-weight: bold;
}
.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e9ecef;
}
</style>
