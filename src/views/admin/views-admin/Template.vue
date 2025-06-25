<template>
    <div class="container-fluid py-4">
        <!-- Bộ lọc -->
        <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
            <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
                <i class="bi bi-funnel-fill me-2 text-dark"></i>
                <h5>Bộ lọc</h5>
            </div>
            <div class="row g-3 m-2 mt-0 p-0">
                <div class="col-md-4">
                    <label class="form-label">Tìm kiếm:</label>
                    <input type="text" class="form-control" placeholder="Nhập từ khoá tìm kiếm" v-model="searchQuery" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Trạng thái</label>
                    <select class="form-select" v-model="selectedStatus">
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Không hoạt động</option>
                    </select>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-outline-primary w-100 me-2" @click="searchWithFilter">
                        <i class="bi bi-funnel"></i> Lọc
                    </button>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-outline-secondary w-100" @click="clearFilters">
                        <i class="bi bi-x-circle me-1"></i>Xoá bộ lọc
                    </button>
                </div>
            </div>
        </div> 
        
        <!-- Nút reload và thêm mới -->
        <div class="d-flex justify-content-end mb-3 gap-2">
            <button class="btn btn-outline-info btn-sm py-2" @click="reloadPage" :disabled="loading">
                <i class="bi bi-arrow-repeat me-1"></i> Làm mới dữ liệu
            </button>
            <button class="btn btn-primary btn-sm py-2" @click="openAddForm"
                style="background-color: #33304e; border-color: #33304e;">
                <i class="bi bi-plus-circle me-1"></i> Thêm mới
            </button>
        </div>

        <!-- Bảng -->
        <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
            <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
                <strong>Bảng dữ liệu mẫu</strong>
            </div>
            <div class="p-3">
                <!-- Loading state -->
                <div v-if="loading" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Đang tải...</span>
                    </div>
                    <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {{ error }}
                    <button class="btn btn-sm btn-outline-danger ms-2" @click="getDataFromApi">
                        Thử lại
                    </button>
                </div>

                <!-- Data table -->
                <div v-else>
                    <table class="table align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Cột 1</th>
                                <th>Cột 2</th>
                                <th>Cột 3</th>
                                <th>Cột 4</th>
                                <th>Cột 5</th>
                                <th>Cột 6</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="templateData.length === 0">
                                <td colspan="9" class="text-center py-4 text-muted">
                                    <i class="bi bi-inbox me-2"></i>
                                    Không có dữ liệu
                                </td>
                            </tr>
                            <tr v-for="(item, index) in templateData" :key="item.id">
                                <td>{{ (currentPage * pageSize) + index + 1 }}</td>
                                <td>{{ item.col1 }}</td>
                                <td>{{ item.col2 }}</td>
                                <td>{{ item.col3 }}</td>
                                <td>{{ item.col4 }}</td>
                                <td>{{ item.col5 }}</td>
                                <td>{{ item.col6 }}</td>
                                <td style="width: 200px;">
                                    <ToggleStatus :id="item.id" v-model="item.status" :true-value="1" :false-value="0"
                                    active-text="Hoạt động" inactive-text="Không hoạt động" @change="handleStatusChange()" />
                                </td>
                                <td >
                                    <EditButton @click="openEditForm" />
                                    <DeleteButton @click="handleDeleteFunction" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <Pagination :page-number="currentPage" :total-pages="totalPages" :is-last-page="isLastPage"
                    :page-size="pageSize" :items-per-page-options="itemsPerPageOptions"
                    :total-elements="templateData.length" @prev="handlePrev" @next="handleNext"
                    @update:pageSize="handlePageSizeChange" />
            </div>

        </div>

        <!-- Modal Thêm/Sửa  -->
        <div class="modal fade" id="formModal" tabindex="-1" aria-labelledby="formModalLabel" aria-hidden="true" style="z-index: 10000;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="formModalLabel">{{ isEditMode ? 'Chỉnh sửa' : 'Thêm mới' }}</h5>
                        <button type="button" class="custom-close-btn" @click="closeModal">
                            <i class='bx  bx-x-circle'></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="handleSubmitForm">
                            <div class="mb-3">
                                <label class="form-label">Cột dữ liệu</label>
                                <input type="text" class="form-control" required placeholder="Nhập dữ liệu" />
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
                        <button type="button" class="btn btn-primary" @click="handleSubmitForm">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import EditButton from '@/components/common/EditButton.vue';
import Pagination from '@/components/common/Pagination.vue';
import DeleteButton from '@/components/common/DeleteButton.vue';
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import { showToast } from '@/utils/swalHelper.js';
import ToggleStatus from '@/components/common/ToggleStatus.vue';

const searchQuery = ref('');
const selectedStatus = ref('');

// Dữ liệu mẫu
const templateData = ref([
    { id: 1, col1: 'Dữ liệu 1', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
    { id: 2, col1: 'Dữ liệu 2', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 0 },
    { id: 3, col1: 'Dữ liệu 3', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
    { id: 4, col1: 'Dữ liệu 4', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
    { id: 5, col1: 'Dữ liệu 5', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 0 },
    { id: 6, col1: 'Dữ liệu 6', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
    { id: 7, col1: 'Dữ liệu 7', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
    { id: 8, col1: 'Dữ liệu 8', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 0 },
    { id: 9, col1: 'Dữ liệu 9', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
    { id: 10, col1: 'Dữ liệu 10', col2: 'A', col3: 'B', col4: 'C', col5: 'D', col6: 'E', status: 1 },
]);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(1);
const totalElements = ref(5);
const itemsPerPageOptions = ref([5, 10, 25, 50]);

// Computed property for last page check
const isLastPage = ref(false);

// API data for points
const loading = ref(false);
const error = ref(null);

const filteredData = ref([]);

const isEditMode = ref(false);

// bộ lọc
const searchWithFilter = () => {
    showToast('info', 'Chức năng tìm kiếm!');
};
const clearFilters = () => {
    showToast('info', 'Chức năng xoá bộ lọc!');
};

//reload
const reloadPage = () => {
    showToast('info', 'Chức năng làm mới dữ liệu!');
};

//trạng thái
const handleStatusChange = (item, newStatus) => {
    showToast('info', 'Chức năng thay đổi trạng thái!');
};

// thêm sửa
const openAddForm = async () => {
    isEditMode.value = false;
    //todo


    const modalElement = document.getElementById('formModal');
    if (modalElement) {
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
};

const openEditForm = async () => {
    isEditMode.value = true;
    //todo



    const modalElement = document.getElementById('formModal');
    if (modalElement) {
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.show();
    }
};

const handleSubmitForm = async () => {
    showToast('success', 'Thêm mới mẫu thành công!');
};

const handleDeleteFunction = async (index) => {
    showToast('warning', 'Chức năng xoá mẫu!');
};

const closeModal = () => {
    const modalElement = document.getElementById('formModal');
    if (modalElement) {
        const modal = Modal.getOrCreateInstance(modalElement);
        modal.hide();
    }
};

// Pagination functions
const handlePrev = () => {
    if (currentPage.value > 0) {
        getDataFromApi(currentPage.value - 1, pageSize.value);
    }
};
const handleNext = () => {
    if (!isLastPage.value) {
        getDataFromApi(currentPage.value + 1, pageSize.value);
    }
};
const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize;
    getDataFromApi(0, newSize); // Reset về trang đầu khi thay đổi page size
};

const resetFormData = () => {
    isEditMode.value = false;
    //todo
};


//load dữ liệu
const getDataFromApi = async (page, size) => {
    //todo
}


onMounted(() => {
    //todo
});

</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.modal-dialog {
    max-width: 600px !important;
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

.modal-body {
    min-height: 320px;
    max-height: 70vh;
    overflow-y: auto;
}
</style>