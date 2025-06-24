<template>
  <div class="p-4">
    <div class="mb-3">
      <h6 class="text-muted">
        Quản lý / <strong>Đánh giá sách</strong>
      </h6>
    </div>

    <!-- Bộ lọc có collapse -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 bg-secondary bg-opacity-10 p-2 py-3 m-0 rounded-top">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5 class="mb-0 flex-grow-1">Bộ lọc</h5>
        <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#filterCollapse" aria-expanded="true" aria-controls="filterCollapse">
          <span class="bi" :class="filterCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'"></span>
        </button>
      </div>
      <div class="collapse show" id="filterCollapse">
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
    </div>

    <div class="card">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

    <div class="d-flex align-items-center justify-content-between mt-5 mb-3">
      <h2 class="fw-bold text-danger m-0">Danh sách đánh giá sách</h2>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle text-center">
        <thead class="table-secondary">
          <tr>
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
        <tbody>
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
            <td>
              <button class="btn btn-outline-info btn-sm me-1" title="Chi tiết" @click="viewReviewDetail(review)">
                <i class="bi bi-info-circle fs-5"></i>
              </button>
              <button class="btn btn-outline-primary btn-sm" title="Cập nhật" @click="editReview(review)">
                <i class="bi bi-pencil fs-5"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Popup for Edit Review -->
    <div class="modal fade show d-block" tabindex="-1" v-if="showModal" style="background: rgba(0,0,0,0.5);" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Cập nhật đánh giá' : 'Chi tiết đánh giá' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
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
    </div>

    <!-- Modal Chi Tiết Review -->
    <div class="modal fade show d-block" tabindex="-1" v-if="showDetailModal" style="background: rgba(0,0,0,0.5);" @click.self="showDetailModal = false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết đánh giá</h5>
            <button type="button" class="btn-close" @click="showDetailModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6" v-for="(field, idx) in detailFields" :key="idx">
                <label class="form-label">{{ field.label }}</label>
                <input type="text" class="form-control" :value="field.value" readonly>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetailModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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
    case 'active': return 'badge bg-success';
    case 'hidden': return 'badge bg-secondary';
    case 'pending': return 'badge bg-warning text-dark';
    case 'edited': return 'badge bg-info text-dark';
    default: return 'badge bg-secondary';
  }
};

// Thêm computed cho detailFields để render các trường chi tiết review
const detailFields = computed(() => [
  { label: 'ID', value: newReview.value.review_id },
  { label: 'Tên sách', value: getBookName(newReview.value.book_id) },
  { label: 'Người đánh giá', value: getUserName(newReview.value.user_id) },
  { label: 'Rating', value: newReview.value.rating },
  { label: 'Bình luận', value: newReview.value.comment },
  { label: 'Ngày đánh giá', value: newReview.value.review_date },
  { label: 'Trạng thái', value: statusText(newReview.value.status) },
  { label: 'Ngày tạo', value: newReview.value.created_at },
  { label: 'Ngày cập nhật', value: newReview.value.updated_at },
  { label: 'Người tạo', value: newReview.value.created_by },
  { label: 'Người cập nhật', value: newReview.value.updated_by },
]);

// Thêm biến để theo dõi trạng thái collapse
const filterCollapsed = ref(false);

onMounted(() => {
  // Lắng nghe sự kiện collapse của Bootstrap để cập nhật icon
  const collapseEl = document.getElementById('filterCollapse');
  if (collapseEl) {
    collapseEl.addEventListener('hide.bs.collapse', () => {
      filterCollapsed.value = true;
    });
    collapseEl.addEventListener('show.bs.collapse', () => {
      filterCollapsed.value = false;
    });
  }
});
</script>

<style>
/* Chỉ giữ lại style nếu Bootstrap không đáp ứng được, còn lại xóa hết */
</style>
