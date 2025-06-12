<template>
  <div class="container mt-4">
    <!-- Breadcrumb -->
    <div class="mb-2" style="font-weight: 500; color: #555;">
      Admin / <span style="color: black; font-weight: bold;">Author</span>
    </div>
      <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-outline-success d-flex align-items-center gap-2" @click="openModal">
        <i class="bi bi-plus-circle"></i>
        Thêm tác giả mới
      </button>
    </div>
  <div class="div-list-author">
    <!-- Tiêu đề danh sách -->
    <div class="author-list-title">
      Danh sách Author
    </div>
   
    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th style="width:170px;">Tên tác giả</th>
            <th>Tiểu sử</th>
            <th style="width:110px;">Ngày sinh</th>
            <th class="text-center text-nowrap" style="width:150px;">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(author, index) in authors" :key="author.id">
            <td>{{ index + 1 }}</td>
            <td>{{ author.authorName }}</td>
            <td style="max-width:200px; white-space:pre-line;">{{ author.biography }}</td>
            <td>{{ formatDate(author.birthDate) }}</td>
            <td class="text-center text-nowrap">
              <div class="d-inline-flex gap-1">
                <button class="btn btn-outline-dark action-btn" @click="viewAuthor(author.id)" title="Xem">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-primary action-btn" @click="editAuthor(author.id)" title="Sửa">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger action-btn" @click="handleDeleteAuthor(author.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
 </div>
    <!-- Form nổi thêm tác giả -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content-custom">
        <h5>Thêm tác giả</h5>
        <form @submit.prevent="add">
          <div class="mb-2">
            <label>Tên tác giả</label>
            <input v-model="author.authorName" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Tiểu sử</label>
            <textarea v-model="author.biography" class="form-control"></textarea>
          </div>
          <div class="mb-2">
            <label>Ngày sinh</label>
            <input v-model="author.birthDate" type="date" class="form-control" />
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
            <button type="submit" class="btn btn-success">Thêm</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Thêm sau modal thêm tác giả -->
    <div v-if="showDetailModal" class="modal-backdrop">
      <div class="modal-content-custom">
        <h5>Chi tiết tác giả</h5>
        <div class="mb-2"><b>ID:</b> {{ detailAuthor.id }}</div>
        <div class="mb-2"><b>Tên tác giả:</b> {{ detailAuthor.authorName }}</div>
        <div class="mb-2"><b>Tiểu sử:</b> {{ detailAuthor.biography }}</div>
        <div class="mb-2"><b>Ngày sinh:</b> {{ detailAuthor.birthDate }}</div>
        <div class="mb-2"><b>Ngày tạo:</b> {{ formatDate(detailAuthor.createdAt) }}</div>
        <div class="mb-2"><b>Ngày cập nhật:</b> {{ formatDate(detailAuthor.updatedAt) }}</div>
        <div class="mb-2"><b>Người tạo:</b> {{ detailAuthor.createdBy }}</div>
        <div class="mb-2"><b>Người cập nhật:</b> {{ detailAuthor.updatedBy }}</div>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button type="button" class="btn btn-secondary" @click="closeDetailModal">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Modal sửa tác giả -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content-custom">
        <h5>Sửa tác giả</h5>
        <form @submit.prevent="update">
          <div class="mb-2">
            <label>Tên tác giả</label>
            <input v-model="editData.authorName" class="form-control" required />
          </div>
          <div class="mb-2">
            <label>Tiểu sử</label>
            <textarea v-model="editData.biography" class="form-control"></textarea>
          </div>
          <div class="mb-2">
            <label>Ngày sinh</label>
            <input v-model="editData.birthDate" type="date" class="form-control" />
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="showEditModal = false">Hủy</button>
            <button type="submit" class="btn btn-success" @click="handleUpdateAuthor(editData.id, editData)">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllAuthors, addAuthor, updateAuthor, deleteAuthor, getAuthorById } from '../store/author'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2'

const authors = ref([])
const showModal = ref(false)
const author = ref({
  authorName: '',
  biography: '',
  birthDate: ''
})
const detailAuthor = ref({
  id: '',
  authorName: '',
  biography: '',
  birthDate: '',
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  updatedBy: ''
})
const showDetailModal = ref(false)
const showEditModal = ref(false)
const editData = ref({
  id: '',
  authorName: '',
  biography: '',
  birthDate: ''
})

onMounted(async () => {
  authors.value = await getAllAuthors()
})

const viewAuthor = async (id) => {
  try {
    detailAuthor.value = await getAuthorById(id)
    showDetailModal.value = true
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tác giả:', error)
  }
}

function openModal() {
  resetForm()
  showModal.value = true
}
function closeModal() {
  resetForm()
  showModal.value = false
}

const add = async () => {
  if (!author.value.authorName) {
    alert('Vui lòng nhập tên tác giả')
    return
  }
  try {
    await addAuthor(author.value)
    authors.value = await getAllAuthors()
    closeModal()
    Swal.fire({
      icon: 'success',
      title: 'Thêm tác giả thành công!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  } catch (error) {
    console.error('Lỗi khi thêm tác giả:', error)
  }
}
function resetForm() {
  author.value = {
    authorName: '',
    biography: '',
    birthDate: ''
  }
}



function closeDetailModal() {
  showDetailModal.value = false
}
const editAuthor = async (id) => {
  try {
    editData.value = await getAuthorById(id)
    showEditModal.value = true
  } catch (error) {
    console.error('Lỗi khi lấy thông tin tác giả:', error)
  }
}
const handleUpdateAuthor = async (id, author) => {
  try {
    await updateAuthor(id, author)
    authors.value = await getAllAuthors()
    showEditModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Cập nhật tác giả thành công!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật tác giả:', error)
    Swal.fire({
      icon: 'error',
      title: 'Cập nhật thất bại!',
      text: 'Không thể cập nhật tác giả.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  }
}

const handleDeleteAuthor = async (id) => {
  const result = await Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa tác giả này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  })
  if (result.isConfirmed) {
    try {
      await deleteAuthor(id)
      authors.value = await getAllAuthors()
      Swal.fire({
        icon: 'success',
        title: 'Xóa tác giả thành công!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Lỗi khi xóa tác giả:', error)
      Swal.fire({
        icon: 'error',
        title: 'Xóa thất bại!',
        text: 'Không thể xóa tác giả.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}
</script>

<style scoped>
.div-list-author {
  
 padding-top: 10px;
  border: 1.5px solid #e0e0e0; 
 border-radius: 10px 10px 0 0px;
}
.table td {
  vertical-align: middle;
}
.table{
  overflow-x: auto
}
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content-custom {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  min-width: 350px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
}
.author-list-title {
 margin-left: 10px;

   background: #fff;
   font-weight: normal; /* Bỏ đậm */
  color: #222;
  font-weight: bold;
  font-size: 1.1rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03); /* Đổ bóng nhẹ nếu muốn */
   border-bottom: 1.5px solid #e0e0e0;
}

.custom-table thead tr {
  background-color: #fff; /* Xóa gạch màu ở top table */
  color: #222;
}
.custom-table {
  margin-top: 40px;

  border-top: 0px;
  border: 1.5px solid #e0e0e0;            /* Viền mờ mờ */
  overflow: hidden;
  width: 100%;
}
.custom-table th:first-child {
  border-top-left-radius: 8px;
}
.custom-table th:last-child {
  border-top-right-radius: 8px;
}
.action-btn {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin: 0 4px;
  padding: 6px 10px;
}

.btn-success {
  border-radius: 8px;
  font-weight: 500;
}

</style>

<!-- Bootstrap Icons CDN -->
