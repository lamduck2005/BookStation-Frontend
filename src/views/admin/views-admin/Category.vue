<template>
  <div class="container mt-4">
    <!-- Breadcrumb -->
    <div class="mb-2" style="font-weight: 500; color: #555;">
      Admin / <span style="color: black; font-weight: bold;">Category</span>
    </div>
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-outline-success d-flex align-items-center gap-2" @click="openModal">
        <i class="bi bi-plus-circle"></i>
        Thêm danh mục mới
      </button>
    </div>
    <div class="div-list-category">
      <!-- Tiêu đề danh sách -->
      <div class="category-list-title">
        Danh sách Category
      </div>
      
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th style="width:170px;">Tên danh mục</th>
              <th>Mô tả</th>
              <th class="text-center text-nowrap" style="width:150px;">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categories" :key="category.id">
              <td>{{ index + 1 }}</td>
              <td>{{ category.categoryName }}</td>
              <td style="max-width:200px; white-space:pre-line;">{{ category.description }}</td>
              <td class="text-center text-nowrap">
                <div class="d-inline-flex gap-1">
                  <button class="btn btn-outline-dark action-btn" @click="viewCategory(category.id)" title="Xem">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="btn btn-outline-primary action-btn" @click="editCategory(category.id)" title="Sửa">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-outline-danger action-btn" @click="handleDeleteCategory(category.id)" title="Xóa">
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
  <!-- Form nổi thêm danh mục -->
  <div v-if="showModal" class="modal-backdrop">
    <div class="modal-content-custom">
      <h5>Thêm danh mục</h5>
      <form @submit.prevent="add">
        <div class="mb-2">
          <label>Tên danh mục</label>
          <input v-model="category.categoryName" class="form-control" required />
        </div>
        <div class="mb-2">
          <label>Mô tả</label>
          <textarea v-model="category.description" class="form-control"></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
          <button type="submit" class="btn btn-success">Thêm</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal chi tiết danh mục -->
  <div v-if="showDetailModal" class="modal-backdrop">
    <div class="modal-content-custom">
      <h5>Chi tiết danh mục</h5>
      <div class="mb-2"><b>ID:</b> {{ detailCategory.id }}</div>
      <div class="mb-2"><b>Tên danh mục:</b> {{ detailCategory.categoryName }}</div>
      <div class="mb-2"><b>Mô tả:</b> {{ detailCategory.description }}</div>
      <div class="mb-2"><b>Ngày tạo:</b> {{ formatDate(detailCategory.createdAt) }}</div>
      <div class="mb-2"><b>Ngày cập nhật:</b> {{ formatDate(detailCategory.updatedAt) }}</div>
      <div class="mb-2"><b>Người tạo:</b> {{ detailCategory.createdBy }}</div>
      <div class="mb-2"><b>Người cập nhật:</b> {{ detailCategory.updatedBy }}</div>
      <div class="d-flex justify-content-end gap-2 mt-3">
        <button type="button" class="btn btn-secondary" @click="closeDetailModal">Đóng</button>
      </div>
    </div>
  </div>

  <!-- Modal sửa danh mục -->
  <div v-if="showEditModal" class="modal-backdrop">
    <div class="modal-content-custom">
      <h5>Sửa danh mục</h5>
      <form @submit.prevent="update">
        <div class="mb-2">
          <label>Tên danh mục</label>
          <input v-model="editData.categoryName" class="form-control" required />
        </div>
        <div class="mb-2">
          <label>Mô tả</label>
          <textarea v-model="editData.description" class="form-control"></textarea>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button type="button" class="btn btn-secondary" @click="showEditModal = false">Hủy</button>
          <button type="submit" class="btn btn-success" @click="handleUpdateCategory(editData.id, editData)">Lưu</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import 'bootstrap-icons/font/bootstrap-icons.css'
import Swal from 'sweetalert2'
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../store/category'
import { updateAuthor } from '../store/author'

const categories = ref([])
const showModal = ref(false)
const category = ref({
  categoryName: '',
  parentCategory: '',
    description: ''
})
const detailCategory = ref({
  id: '',
  categoryName: '',
  description: '',
  parentCategory: '',
  createdAt: '',
  updatedAt: '',
  createdBy: '',
  updatedBy: ''
})
const showDetailModal = ref(false)
const showEditModal = ref(false)
const editData = ref({
  id: '',
  categoryName: '',
  description: ''
})


onMounted(async () => {
  try {
    categories.value = await getAllCategories()
  } catch (error) {
    console.error('Lỗi khi tải danh sách danh mục:', error)
  }
})

const viewCategory = async (id) => {
  try {
    detailCategory.value = await getCategoryById(id)
    showDetailModal.value = true
  } catch (error) {
    console.error('Lỗi khi lấy thông tin danh mục:', error)
  }
}

const openModal = () => {
  resetForm()
  showModal.value = true
}
const closeModal = () => {
  resetForm()
  showModal.value = false
}

const add = async () => {
  if (!category.value.categoryName) {
    alert('Vui lòng nhập tên danh mục')
    return
  }
  try {
    await addCategory(category.value)
    categories.value = await getAllCategories()
    closeModal()
    Swal.fire({
      icon: 'success',
      title: 'Thêm danh mục thành công!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error)
    Swal.fire({
      icon: 'error',
      title: 'Thêm thất bại!',
      text: 'Không thể thêm danh mục.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  }
}
const resetForm = () => {
  category.value = {
    categoryName: '',
    description: ''
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
}
const editCategory = async (id) => {
  try {
    editData.value = await getCategoryById(id)
    console.log('Edit Data:', editData.value)
    showEditModal.value = true
  } catch (error) {
    console.error('Lỗi khi lấy thông tin danh mục:', error)
  }
  }

const handleUpdateCategory = async (id, category) => {
  try {
    await updateCategory(id, category)
    categories.value = await getAllCategories()
    showEditModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Cập nhật danh mục thành công!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error)
    Swal.fire({
      icon: 'error',
      title: 'Cập nhật thất bại!',
      text: 'Không thể cập nhật danh mục.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  }
}

const handleDeleteCategory = async (id) => {
  const result = await Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa danh mục này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  })
  if (result.isConfirmed) {
    try {
      await deleteCategory(id)
      categories.value = await getAllCategories()
      Swal.fire({
        icon: 'success',
        title: 'Xóa danh mục thành công!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error)
      Swal.fire({
        icon: 'error',
        title: 'Xóa thất bại!',
        text: 'Không thể xóa danh mục.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }
}
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}
</script>

<style scoped>
.div-list-category {
  padding-top: 10px;
  border: 1.5px solid #e0e0e0; 
  border-radius: 10px 10px 0 0px;
}
.table td {
  vertical-align: middle;
}
.table {
  overflow-x: auto
}
.modal-backdrop {
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0;
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
.category-list-title {
  margin-left: 10px;
  background: none;
  font-weight: bold;
  color: #222;
  font-size: 1.1rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03); 
  border-bottom: 1.5px solid #e0e0e0;
}

.custom-table {
  margin-top: 20px;
  border-top: none;
  border: 1.5px solid #e0e0e0;          
  overflow: hidden;
  width: 100%;
}
.custom-table thead tr {
  background-color: #fff; 
  color: #222;
}
.custom-table th:first-child {
  border-top-left-radius: 8px;
}
.custom-table th:last-child {
  border-top-right-radius: 8px;
}
.action-btn {
  border: 1.5px solid #dee2e6;
  border-radius: 8px;
  margin: 0 4px;
  padding: 6px 10px;
}

.btn-success {
  border-radius: 8px;
  font-weight: 500;
}
</style>