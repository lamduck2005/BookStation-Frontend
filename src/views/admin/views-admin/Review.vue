<template>
  <div style="padding: 32px;">
    <div class="mb-3">
      <h6 class="text-muted">
        Quản lý / <strong>Đánh giá sách</strong>
      </h6>
    </div>

    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 text-bg-secondary p-2 m-0 rounded-top" id="">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5>Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-6">
          <label class="form-label">Tên sách:</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên sách"
            v-model="searchQuery"
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="selectedStatus">
            <option value="">Tất cả</option>
            <option value="active">Hiển thị</option>
            <option value="hidden">Bị ẩn</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="edited">Đã chỉnh sửa</option>
          </select>
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-between mt-5 mb-3">
      <h2 class="table-title m-0">Danh sách đánh giá sách</h2>
    </div>
    <div class="dashboard-container">
      <div class="dashboard-table">
        <table id="main-table" class="display">
          <thead>
            <tr class="text-center">
              <th>ID</th>
              <th>Tên sách</th>
              <th>Người đánh giá</th>
              <th>Rating</th>
              <th>Bình luận</th>
              <th>Ngày đánh giá</th>
              <th>Trạng thái</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <tr v-for="(review, index) in filteredList" :key="index">
              <td>{{ review.review_id }}</td>
              <td>{{ getBookName(review.book_id) }}</td>
              <td>{{ getUserName(review.user_id) }}</td>
              <td>{{ review.rating }}</td>
              <td>{{ review.comment }}</td>
              <td>{{ formatDateTime(review.review_date) }}</td>
              <td>
                <span :class="statusClass(review.status)">
                  {{ statusText(review.status) }}
                </span>
              </td>
              <td class="action-cell">
                <a class="btn btn-custom tooltip-custom" data-tooltip="Chi tiết" @click="viewReviewDetail(review)">
                  <i class="bi bi-info-circle fs-5"></i>
                </a>
                <a class="btn btn-custom tooltip-custom" data-tooltip="Cập nhật" @click="editReview(review)">
                  <i class="bi bi-pencil fs-5"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Popup for Edit Review -->
    <div class="modal-overlay" v-if="showModal" @click="closeModalOnOutsideClick">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h5>{{ isEditMode ? 'Cập nhật đánh giá' : 'Chi tiết đánh giá' }}</h5>
          <i class="bi bi-x-lg close-icon" @click="closeModal"></i>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" v-model="newReview.review_id" readonly>
          </div>
          <div class="mb-3">
            <label class="form-label">Tên sách</label>
            <input type="text" class="form-control" :value="getBookName(newReview.book_id)" readonly>
          </div>
          <div class="mb-3">
            <label class="form-label">Người đánh giá</label>
            <input type="text" class="form-control" :value="getUserName(newReview.user_id)" readonly>
          </div>
          <div class="mb-3">
            <label class="form-label">Rating</label>
            <input type="number" class="form-control" v-model="newReview.rating" :readonly="!isEditMode">
          </div>
          <div class="mb-3">
            <label class="form-label">Bình luận</label>
            <textarea class="form-control" v-model="newReview.comment" :readonly="!isEditMode"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Ngày đánh giá</label>
            <input type="text" class="form-control" v-model="newReview.review_date" readonly>
          </div>
          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" v-model="newReview.status" :disabled="!isEditMode">
              <option value="active">Hiển thị</option>
              <option value="hidden">Bị ẩn</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="edited">Đã chỉnh sửa</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
          <button v-if="isEditMode" type="button" class="btn btn-primary" @click="saveReview">Cập nhật</button>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Review -->
    <div class="modal-overlay" v-if="showDetailModal" @click="closeDetailModalOnOutsideClick">
      <div class="modal-detail modal-detail-wide" @click.stop>
        <div class="modal-header">
          <h5>Chi tiết đánh giá</h5>
          <i class="bi bi-x-lg close-icon" @click="showDetailModal = false"></i>
        </div>
        <div class="modal-body-detail modal-body-detail-grid">
          <div class="detail-field">
            <label class="form-label">ID</label>
            <input type="text" class="form-control" :value="newReview.review_id" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Tên sách</label>
            <input type="text" class="form-control" :value="getBookName(newReview.book_id)" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người đánh giá</label>
            <input type="text" class="form-control" :value="getUserName(newReview.user_id)" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Rating</label>
            <input type="text" class="form-control" :value="newReview.rating" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Bình luận</label>
            <input type="text" class="form-control" :value="newReview.comment" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày đánh giá</label>
            <input type="text" class="form-control" :value="newReview.review_date" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Trạng thái</label>
            <input type="text" class="form-control" :value="statusText(newReview.status)" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày tạo</label>
            <input type="text" class="form-control" :value="newReview.created_at" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Ngày cập nhật</label>
            <input type="text" class="form-control" :value="newReview.updated_at" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người tạo</label>
            <input type="text" class="form-control" :value="newReview.created_by" readonly>
          </div>
          <div class="detail-field">
            <label class="form-label">Người cập nhật</label>
            <input type="text" class="form-control" :value="newReview.updated_by" readonly>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showDetailModal = false">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { showToast } from '@/utils/swalHelper';

// Dữ liệu mẫu cho sách và user
const bookList = ref([
  { id: 1, name: 'Đắc Nhân Tâm' },
  { id: 2, name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu' },
  { id: 3, name: 'Nhà Giả Kim' },
  { id: 4, name: 'Bí Mật Của May Mắn' },
  { id: 5, name: 'Totto-chan Bên Cửa Sổ' },
]);
const userList = ref([
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
  { id: 4, name: 'Phạm Thị D' },
  { id: 5, name: 'Hoàng Văn E' },
]);

const getBookName = (id) => {
  const book = bookList.value.find(b => b.id === id);
  return book ? book.name : '';
};
const getUserName = (id) => {
  const user = userList.value.find(u => u.id === id);
  return user ? user.name : '';
};

const searchQuery = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isEditMode = ref(false);
const showDetailModal = ref(false);

const reviewList = ref([
  {
    review_id: 1,
    book_id: 1,
    user_id: 1,
    rating: 5,
    comment: 'Sách rất hay, truyền cảm hứng!',
    review_date: '2024-06-01',
    status: 'active',
    created_at: '2024-06-01',
    updated_at: '2024-06-01',
    created_by: 'admin',
    updated_by: 'admin',
  },
  {
    review_id: 2,
    book_id: 2,
    user_id: 2,
    rating: 4,
    comment: 'Nội dung ý nghĩa, dễ hiểu.',
    review_date: '2024-06-02',
    status: 'active',
    created_at: '2024-06-02',
    updated_at: '2024-06-02',
    created_by: 'admin',
    updated_by: 'admin',
  },
  {
    review_id: 3,
    book_id: 3,
    user_id: 3,
    rating: 3,
    comment: 'Bình thường, chưa đặc sắc.',
    review_date: '2024-06-03',
    status: 'hidden',
    created_at: '2024-06-03',
    updated_at: '2024-06-03',
    created_by: 'admin',
    updated_by: 'admin',
  },
  {
    review_id: 4,
    book_id: 4,
    user_id: 4,
    rating: 5,
    comment: 'Rất đáng đọc!',
    review_date: '2024-06-04',
    status: 'active',
    created_at: '2024-06-04',
    updated_at: '2024-06-04',
    created_by: 'admin',
    updated_by: 'admin',
  },
  {
    review_id: 5,
    book_id: 5,
    user_id: 5,
    rating: 2,
    comment: 'Không phù hợp với mình.',
    review_date: '2024-06-05',
    status: 'hidden',
    created_at: '2024-06-05',
    updated_at: '2024-06-05',
    created_by: 'admin',
    updated_by: 'admin',
  },
]);

const newReview = ref({});

const filteredList = computed(() => {
  return reviewList.value.filter(r =>
    (!searchQuery.value || getBookName(r.book_id).toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (!selectedStatus.value ||
      (selectedStatus.value === 'active' && r.status === 'active') ||
      (selectedStatus.value === 'hidden' && r.status === 'hidden'))
  );
});

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString('vi-VN');
};

const closeModalOnOutsideClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
};

const closeDetailModalOnOutsideClick = (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    showDetailModal.value = false;
  }
};

const viewReviewDetail = (review) => {
  newReview.value = { ...review };
  showDetailModal.value = true;
  isEditMode.value = false;
};

const editReview = (review) => {
  newReview.value = { ...review };
  showModal.value = true;
  isEditMode.value = true;
};

const deleteReview = (review) => {
  // Xử lý logic xóa review ở đây
  showToast('success', 'Xóa review: ' + review.review_id);
};

const closeModal = () => {
  showModal.value = false;
};

const saveReview = () => {
  // Xử lý logic cập nhật review ở đây
  showToast('success', 'Cập nhật review: ' + newReview.value.review_id);
  closeModal();
};

const statusText = (status) => {
  switch (status) {
    case 'active': return 'Hiển thị';
    case 'hidden': return 'Bị ẩn';
    case 'pending': return 'Chờ xác nhận';
    case 'edited': return 'Đã chỉnh sửa';
    default: return status;
  }
};

const statusClass = (status) => {
  switch (status) {
    case 'active': return 'badge bg-success-subtle text-success';
    case 'hidden': return 'badge bg-secondary-subtle text-secondary';
    case 'pending': return 'badge bg-warning-subtle text-warning';
    case 'edited': return 'badge bg-info-subtle text-info';
    default: return 'badge bg-secondary';
  }
};
</script>

<style>
/* ... giữ nguyên style từ Flash_Sale.vue ... */
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

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.close-icon {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #e9ecef;
}

.required::after {
  content: "*";
  color: red;
  margin-left: 4px;
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
</style>
