<template>
  <div class="container-fluid py-4">
    <!-- Breadcrumb -->
    <div class="mb-3">
      <h6 class="text-muted">
        Quản lý / <strong>Nhà cung cấp</strong>
      </h6>
    </div>
    
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5 class="mb-0">Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0">
        <div class="col-md-4">
          <label class="form-label">Tên nhà cung cấp</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên nhà cung cấp" 
            v-model="searchQuery" 
            @input="debouncedSearch"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Email</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập email nhà cung cấp" 
            v-model="emailFilter" 
            @input="debouncedSearch"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Người đại diện</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập tên người đại diện" 
            v-model="contactNameFilter" 
            @input="debouncedSearch"
          />
        </div>
      </div>
      <div class="row g-3 m-2 mt-2 p-0">
        <div class="col-md-4">
          <label class="form-label">Số điện thoại</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Nhập số điện thoại" 
            v-model="phoneFilter" 
            @input="debouncedSearch"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Trạng thái</label>
          <select class="form-select" v-model="statusFilter" @change="applyFilters">
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button type="button" class="btn btn-secondary me-2" @click="resetFilter">
            <i class="bi bi-arrow-clockwise me-1"></i>
            Xóa bộ lọc
          </button>
          <button type="button" class="btn btn-primary" @click="applyFilters">
            <i class="bi bi-search me-1"></i>
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>

    <!-- Nút thêm mới -->
    <div class="d-flex justify-content-end mb-3">
      <AddButton @click="openAddSupplier" />
    </div>

    <!-- Danh sách nhà cung cấp -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div class="d-flex align-items-center mb-3 p-2 m-0 rounded-top" style="background-color: #ecae9e;">
        <strong>Danh sách nhà cung cấp</strong>
      </div>
      <div class="p-3">
        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th style="min-width: 50px;">STT</th>
                <th style="min-width: 200px;">Tên nhà cung cấp</th>
                <th style="min-width: 150px;">Người đại diện</th>
                <th style="min-width: 120px;">Số điện thoại</th>
                <th style="min-width: 180px;">Email</th>
                <th style="min-width: 120px;">Website</th>
                <th style="min-width: 100px;">Trạng thái</th>
                <th style="min-width: 120px;">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(supplier, index) in pagedSuppliers" :key="supplier.id" @click="showDetail(supplier)" style="cursor: pointer">
                <td>{{ currentPage * pageSize + index + 1 }}</td>
                <td>
                  <div>
                    <strong>{{ supplier.supplierName }}</strong>
                    <div class="text-muted small">{{ truncateText(supplier.address, 40) }}</div>
                  </div>
                </td>
                <td>{{ supplier.contactName }}</td>
                <td>{{ supplier.phoneNumber || supplier.phone }}</td>
                <td>{{ supplier.email }}</td>
                <td>
                  <a v-if="supplier.website" :href="supplier.website" target="_blank" class="text-primary" @click.stop>
                    <small>{{ truncateText(supplier.website, 25) }}</small>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td @click.stop>
                  <ToggleStatus
                    :id="supplier.id"
                    v-model="supplier.status"
                    :true-value="1"
                    :false-value="0"
                    active-text="Hoạt động"
                    inactive-text="Không hoạt động"
                    @change="handleStatusChange(supplier, $event)"
                  />
                </td>
                <td @click.stop>
                  <div class="d-flex gap-2">
                    <EditButton @click="openEditSupplier(supplier)" />
                    <DeleteButton @click="deleteSupplierHandler(supplier)" />
                  </div>
                </td>
              </tr>
              <tr v-if="pagedSuppliers.length === 0">
                <td colspan="8" class="text-center py-4">
                  <div class="text-muted">
                    <i class="bi bi-inbox-fill me-2 fs-5"></i>
                    Không có dữ liệu nhà cung cấp
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Pagination
          :page-number="currentPage"
          :total-pages="totalPages"
          :is-last-page="isLastPage"
          :page-size="pageSize"
          :items-per-page-options="itemsPerPageOptions"
          :total-elements="totalElements"
          @prev="handlePrev"
          @next="handleNext"
          @update:pageSize="handlePageSizeChange"
        />
      </div>
    </div>
  </div>

  <!-- Modal Thêm/Cập nhật nhà cung cấp -->
  <div
    class="modal fade"
    id="addSupplierModal"
    tabindex="-1"
    aria-labelledby="addSupplierModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content enhanced-modal">
        <div class="modal-header gradient-header">
          <h5 class="modal-title" id="addSupplierModalLabel">
            <i class="bi bi-building me-2"></i>
            {{ isEditMode ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp mới" }}
          </h5>
          <button
            type="button"
            class="custom-close-btn"
            @click="closeModal"
            aria-label="Close"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body enhanced-body">
          <!-- Nút Fake Data ở đầu modal body (nếu cần) -->
          <div v-if="!isEditMode" class="mb-3 text-end">
            <button 
              type="button" 
              class="btn btn-outline-warning btn-sm rounded-pill fake-data-btn"
              @click="fillFakeData"
              title="Điền dữ liệu mẫu để test nhanh"
            >
              🎲 Fake Data (Test)
            </button>
          </div>
          
          <form @submit.prevent="submitSupplierForm">
            <!-- Section 1: Thông tin cơ bản -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-info-circle section-icon"></i>
                <h6 class="section-title">Thông tin cơ bản</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="enhanced-label">
                    Tên nhà cung cấp <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="supplierForm.supplierName"
                    class="enhanced-input form-control"
                    :class="{'is-invalid': formErrors.supplierName}"
                    placeholder="Nhập tên nhà cung cấp"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.supplierName">
                    {{ formErrors.supplierName }}
                  </div>
                  <div class="form-text" v-else>Tên nhà cung cấp phải là duy nhất, tối đa 255 ký tự</div>
                </div>
                <div class="col-md-6">
                  <label class="enhanced-label">
                    Email <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="supplierForm.email"
                    class="enhanced-input form-control"
                    :class="{'is-invalid': formErrors.email}"
                    placeholder="Nhập email"
                    required
                    type="email"
                  />
                  <div class="invalid-feedback" v-if="formErrors.email">
                    {{ formErrors.email }}
                  </div>
                  <div class="form-text" v-else>Email phải đúng định dạng và là duy nhất</div>
                </div>
                <div class="col-md-6">
                  <label class="enhanced-label">
                    Người đại diện <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="supplierForm.contactName"
                    class="enhanced-input form-control"
                    :class="{'is-invalid': formErrors.contactName}"
                    placeholder="Nhập tên người đại diện"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.contactName">
                    {{ formErrors.contactName }}
                  </div>
                  <div class="form-text" v-else>Tên người đại diện, tối đa 100 ký tự</div>
                </div>
                <div class="col-md-6">
                  <label class="enhanced-label">
                    Số điện thoại <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="supplierForm.phoneNumber"
                    class="enhanced-input form-control"
                    :class="{'is-invalid': formErrors.phoneNumber}"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                  <div class="invalid-feedback" v-if="formErrors.phoneNumber">
                    {{ formErrors.phoneNumber }}
                  </div>
                  <div class="form-text" v-else>Số điện thoại hợp lệ, tối đa 20 ký tự</div>
                </div>
              </div>
            </div>

            <!-- Section 2: Thông tin bổ sung -->
            <div class="form-section">
              <div class="section-header">
                <i class="bi bi-card-text section-icon"></i>
                <h6 class="section-title">Thông tin bổ sung</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="enhanced-label">
                    Website
                  </label>
                  <input
                    v-model="supplierForm.website"
                    class="enhanced-input form-control"
                    :class="{'is-invalid': formErrors.website}"
                    placeholder="https://example.com"
                    type="url"
                  />
                  <div class="invalid-feedback" v-if="formErrors.website">
                    {{ formErrors.website }}
                  </div>
                  <div class="form-text" v-else>URL website của nhà cung cấp</div>
                </div>
                <div class="col-md-6">
                  <label class="enhanced-label">
                    Trạng thái
                  </label>
                  <select v-model="supplierForm.status" class="enhanced-input form-select">
                    <option :value="1">Hoạt động</option>
                    <option :value="0">Không hoạt động</option>
                  </select>
                </div>
                <div class="col-md-12">
                  <label class="enhanced-label">
                    Địa chỉ <span class="text-danger">*</span>
                  </label>
                  <textarea
                    v-model="supplierForm.address"
                    class="enhanced-input form-control"
                    :class="{'is-invalid': formErrors.address}"
                    placeholder="Nhập địa chỉ"
                    required
                    rows="2"
                  ></textarea>
                  <div class="invalid-feedback" v-if="formErrors.address">
                    {{ formErrors.address }}
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="enhanced-label">Mô tả</label>
                  <textarea
                    v-model="supplierForm.description"
                    class="enhanced-input form-control"
                    rows="3"
                    placeholder="Nhập mô tả về nhà cung cấp"
                  ></textarea>
                </div>
              </div>
            </div>

            <div v-if="formError" class="alert alert-danger py-2 mt-3">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ formError }}
            </div>
          </form>
        </div>
        <div class="modal-footer enhanced-footer">
          <button
            type="button"
            class="btn btn-cancel"
            @click="closeModal"
          >
            <i class="bi bi-x-circle me-1"></i>
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-submit"
            @click="submitSupplierForm"
          >
            <i class="bi bi-check-circle me-1"></i>
            {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditButton from "@/components/common/EditButton.vue";
import AddButton from "@/components/common/AddButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
import ToggleStatus from "@/components/common/ToggleStatus.vue";
import StatusLabel from "@/components/common/StatusLabel.vue";
import { showToast } from "@/utils/swalHelper";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  upStatusSupplier,
} from "@/services/admin/supplier";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import { ref, watch, onMounted, computed } from "vue";
import Pagination from "@/components/common/Pagination.vue";
import { debounce } from "lodash";

export default {
  components: {
    Pagination,
    EditButton,
    DeleteButton,
    ToggleStatus,
    StatusLabel,
    AddButton
  },
  setup() {
    // Phân trang & filter
    const currentPage = ref(0);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);
    const isLastPage = ref(false);
    const itemsPerPageOptions = ref([5, 10, 25, 50, 100]);
    const pagedSuppliers = ref([]);
    
    // Bộ lọc
    const searchQuery = ref("");
    const statusFilter = ref("");
    const phoneFilter = ref("");
    const emailFilter = ref("");
    const contactNameFilter = ref("");
    
    // Debounce tìm kiếm
    const debouncedSearch = debounce(() => {
      applyFilters();
    }, 500);

    // Modal & form
    const isEditMode = ref(false);
    const supplierForm = ref({
      supplierName: "",
      contactName: "",
      phoneNumber: "",
      email: "",
      address: "",
      website: "",
      description: "",
      status: 1
    });
    const editingSupplier = ref(null);
    const formError = ref("");
    const formErrors = ref({});
    
    // Cắt ngắn văn bản quá dài
    function truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Lấy dữ liệu từ API
    async function fetchSuppliers() {
      try {
        const params = {
          page: currentPage.value,
          size: pageSize.value,
          supplierName: searchQuery.value || undefined,
          status: statusFilter.value || undefined,
          phone: phoneFilter.value || undefined,
          email: emailFilter.value || undefined,
          contactName: contactNameFilter.value || undefined
        };
        
        // Xóa các tham số undefined để không gửi lên API
        Object.keys(params).forEach(key => {
          if (params[key] === undefined) {
            delete params[key];
          }
        });
        
        const data = await getSuppliers(params);
        
        // Xử lý và chuẩn hóa dữ liệu từ API
        pagedSuppliers.value = (data.content || []).map(item => ({
          ...item,
          // Chuẩn hóa tên trường: API có thể trả về phoneNumber hoặc phone
          phoneNumber: item.phoneNumber || item.phone,
          // Đảm bảo status luôn là số 0 hoặc 1
          status: item.status === 1 ? 1 : 0,
        }));
        
        totalElements.value = data.totalElements || 0;
        totalPages.value = data.totalPages || 1;
        isLastPage.value = currentPage.value >= totalPages.value - 1;
      } catch (e) {
        console.error("API Error:", e);
        showToast("error", "Không thể tải danh sách nhà cung cấp!");
      }
    }

    // Áp dụng bộ lọc
    function applyFilters() {
      currentPage.value = 0; // Reset về trang đầu tiên khi lọc
      fetchSuppliers();
    }

    // Reset bộ lọc
    function resetFilter() {
      searchQuery.value = "";
      statusFilter.value = "";
      phoneFilter.value = "";
      emailFilter.value = "";
      contactNameFilter.value = "";
      currentPage.value = 0;
      fetchSuppliers();
    }

    // Validate form
    function validateForm() {
      // Reset errors
      formErrors.value = {};
      formError.value = "";
      
      const { supplierName, contactName, phoneNumber, email, address, website } = supplierForm.value;
      let isValid = true;
      
      // Validate required fields
      if (!supplierName || supplierName.trim() === '') {
        formErrors.value.supplierName = "Tên nhà cung cấp không được để trống";
        isValid = false;
      } else if (supplierName.length > 255) {
        formErrors.value.supplierName = "Tên nhà cung cấp không được quá 255 ký tự";
        isValid = false;
      }
      
      if (!contactName || contactName.trim() === '') {
        formErrors.value.contactName = "Người đại diện không được để trống";
        isValid = false;
      } else if (contactName.length > 100) {
        formErrors.value.contactName = "Người đại diện không được quá 100 ký tự";
        isValid = false;
      }
      
      if (!phoneNumber || phoneNumber.trim() === '') {
        formErrors.value.phoneNumber = "Số điện thoại không được để trống";
        isValid = false;
      } else if (!isValidPhone(phoneNumber)) {
        formErrors.value.phoneNumber = "Số điện thoại không hợp lệ";
        isValid = false;
      } else if (phoneNumber.length > 20) {
        formErrors.value.phoneNumber = "Số điện thoại không được quá 20 ký tự";
        isValid = false;
      }
      
      if (!email || email.trim() === '') {
        formErrors.value.email = "Email không được để trống";
        isValid = false;
      } else if (!isValidEmail(email)) {
        formErrors.value.email = "Email không hợp lệ";
        isValid = false;
      } else if (email.length > 100) {
        formErrors.value.email = "Email không được quá 100 ký tự";
        isValid = false;
      }
      
      if (!address || address.trim() === '') {
        formErrors.value.address = "Địa chỉ không được để trống";
        isValid = false;
      } else if (address.length > 500) {
        formErrors.value.address = "Địa chỉ không được quá 500 ký tự";
        isValid = false;
      }
      
      // Website (optional but must be valid URL if provided)
      if (website && website.trim() !== '') {
        if (!isValidUrl(website)) {
          formErrors.value.website = "Website không hợp lệ";
          isValid = false;
        } else if (website.length > 255) {
          formErrors.value.website = "Website không được quá 255 ký tự";
          isValid = false;
        }
      }
      
      return isValid;
    }

    // Validate email, phone and URL
    function isValidEmail(email) {
      const regex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
    }
    
    function isValidPhone(phone) {
      // Chấp nhận số và các ký tự đặc biệt +, -, space
      const regex = /^[0-9+\- ]{10,20}$/;
      return regex.test(phone);
    }
    
    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    }

    // Mở modal thêm nhà cung cấp
    function openAddSupplier() {
      isEditMode.value = false;
      formError.value = "";
      formErrors.value = {};
      
      supplierForm.value = {
        supplierName: "",
        contactName: "",
        phoneNumber: "",
        email: "",
        address: "",
        website: "",
        description: "",
        status: 1,
        createdBy: "admin",
        updatedBy: "admin"
      };
      
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }

    // Mở modal chỉnh sửa nhà cung cấp
    function openEditSupplier(supplier) {
      isEditMode.value = true;
      formError.value = "";
      formErrors.value = {};
      editingSupplier.value = supplier;
      
      supplierForm.value = {
        id: supplier.id,
        supplierName: supplier.supplierName,
        contactName: supplier.contactName,
        phoneNumber: supplier.phoneNumber || supplier.phone,
        email: supplier.email,
        address: supplier.address,
        website: supplier.website || "",
        description: supplier.description || "",
        status: supplier.status,
        updatedBy: "admin"
      };
      
      const modalElement = document.getElementById("addSupplierModal");
      const modal = Modal.getOrCreateInstance(modalElement);
      modal.show();
    }

    // Xóa nhà cung cấp
    async function deleteSupplierHandler(supplier) {
      Swal.fire({
        title: `Xác nhận xóa nhà cung cấp?`,
        text: `Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.supplierName}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteSupplier(supplier.id);
            showToast("success", "Đã xóa nhà cung cấp thành công");
            await fetchSuppliers();
          } catch (error) {
            let errorMsg = "Xóa thất bại!";
            if (error.response && error.response.data && error.response.data.error) {
              errorMsg = error.response.data.error;
            } else if (error.message) {
              errorMsg = error.message;
            }
            showToast("error", errorMsg);
          }
        }
      });
    }

    // Hiển thị chi tiết nhà cung cấp
    function showDetail(supplier) {
      Swal.fire({
        title: `<strong>Chi tiết nhà cung cấp</strong>`,
        html: `
          <div class="swal-supplier-detail">
            <table class="table table-sm table-bordered">
              <tr>
                <th style="width: 35%">Tên nhà cung cấp</th>
                <td>${supplier.supplierName || "-"}</td>
              </tr>
              <tr>
                <th>Người đại diện</th>
                <td>${supplier.contactName || "-"}</td>
              </tr>
              <tr>
                <th>Số điện thoại</th>
                <td>${supplier.phoneNumber || supplier.phone || "-"}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>${supplier.email || "-"}</td>
              </tr>
              <tr>
                <th>Địa chỉ</th>
                <td>${supplier.address || "-"}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>${supplier.website ? `<a href="${supplier.website}" target="_blank">${supplier.website}</a>` : "-"}</td>
              </tr>
              <tr>
                <th>Mô tả</th>
                <td>${supplier.description || "-"}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td><span class="badge ${supplier.status === 1 ? 'bg-success' : 'bg-danger'}">${supplier.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</span></td>
              </tr>
              <tr>
                <th>Người tạo</th>
                <td>${supplier.createdBy || "-"}</td>
              </tr>
              <tr>
                <th>Ngày tạo</th>
                <td>${formatDateTime(supplier.createdAt)}</td>
              </tr>
              <tr>
                <th>Người cập nhật</th>
                <td>${supplier.updatedBy || "-"}</td>
              </tr>
              <tr>
                <th>Ngày cập nhật</th>
                <td>${formatDateTime(supplier.updatedAt)}</td>
              </tr>
            </table>
          </div>
        `,
        confirmButtonText: "Đóng",
        width: '600px',
        customClass: {
          htmlContainer: 'supplier-detail-container'
        }
      });
    }

    // Format date time
    function formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    // Phân trang
    function handlePrev() {
      if (currentPage.value > 0) {
        currentPage.value--;
        fetchSuppliers();
      }
    }
    
    function handleNext() {
      if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
        fetchSuppliers();
      }
    }
    
    function handlePageSizeChange(newSize) {
      pageSize.value = newSize;
      currentPage.value = 0;
      fetchSuppliers();
    }

    // Fill fake data function
    function fillFakeData() {
      supplierForm.value = {
        supplierName: "Công ty Fahasa",
        contactName: "Nguyễn Văn An",
        phoneNumber: "028-3822-5798",
        email: "supplier@fahasa.com",
        address: "40 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        website: "https://fahasa.com",
        description: "Nhà phân phối sách hàng đầu Việt Nam với hơn 20 năm kinh nghiệm trong ngành.",
        status: 1,
        createdBy: "admin",
        updatedBy: "admin"
      };
    }

    // Close modal function
    function closeModal() {
      try {
        const modalElement = document.getElementById("addSupplierModal");
        if (modalElement) {
          // Tìm modal instance hiện tại
          const modal = Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          } else {
            // Nếu không có instance, tạo mới và hide
            const newModal = new Modal(modalElement);
            newModal.hide();
          }
          
          // Đảm bảo cleanup hoàn toàn
          setTimeout(() => {
            // Remove backdrop
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // Remove modal classes from body
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('padding-right');
            
            // Reset modal state
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
          }, 150);
        } else {
          console.error('Modal element not found when trying to close');
        }
      } catch (error) {
        console.error('Error closing modal:', error);
        // Force cleanup nếu có lỗi
        forceCleanupModal();
      }
    }

    // Helper function để force cleanup modal
    function forceCleanupModal() {
      // Remove all backdrops
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      
      // Remove modal classes from body
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      
      // Hide modal element
      const modalElement = document.getElementById("addSupplierModal");
      if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
      }
    }

    // Submit form thêm/sửa nhà cung cấp
    async function submitSupplierForm() {
      if (!validateForm()) {
        return;
      }

      try {
        if (isEditMode.value && editingSupplier.value) {
          // Cập nhật nhà cung cấp
          await updateSupplier({
            ...supplierForm.value,
            phone: supplierForm.value.phoneNumber, // Đảm bảo API nhận đúng tên trường
          });
          showToast("success", "Đã cập nhật nhà cung cấp thành công");
        } else {
          // Thêm mới nhà cung cấp
          await createSupplier({
            ...supplierForm.value,
            phone: supplierForm.value.phoneNumber, // Đảm bảo API nhận đúng tên trường
          });
          showToast("success", "Đã thêm nhà cung cấp mới thành công");
        }
        
        // Đóng modal và reload dữ liệu
        closeModal();
        await fetchSuppliers();
      } catch (error) {
        console.error("API Error:", error);
        
        // Xử lý lỗi từ API
        let errorMsg = "Có lỗi xảy ra khi lưu nhà cung cấp!";
        
        if (error.response && error.response.data) {
          if (error.response.data.error) {
            errorMsg = error.response.data.error;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        formError.value = errorMsg;
      }
    }

    // Xử lý thay đổi trạng thái nhà cung cấp
    const handleStatusChange = async (supplier, newStatus) => {
      try {
        // API cần status là số 0/1
        const statusValue = newStatus ? 1 : 0;
        await upStatusSupplier(supplier.id, statusValue, "admin");
        showToast("success", "Đã thay đổi trạng thái nhà cung cấp");
        await fetchSuppliers(); // Refresh data
      } catch (error) {
        console.error("API Error:", error);
        let errorMsg = "Cập nhật trạng thái thất bại!";
        
        if (error.response && error.response.data && error.response.data.error) {
          errorMsg = error.response.data.error;
        }
        
        showToast("error", errorMsg);
        // Rollback trạng thái nếu lỗi
        supplier.status = !newStatus ? 1 : 0;
      }
    };

    // Fetch data khi component được mount
    onMounted(() => {
      fetchSuppliers();
    });

    return {
      // Phân trang
      currentPage,
      pageSize,
      totalPages,
      totalElements,
      isLastPage,
      itemsPerPageOptions,
      // Dữ liệu
      pagedSuppliers,
      // Bộ lọc
      searchQuery,
      statusFilter,
      phoneFilter,
      emailFilter,
      contactNameFilter,
      debouncedSearch,
      applyFilters,
      resetFilter,
      // Format
      truncateText,
      // Modal & form
      isEditMode,
      supplierForm,
      editingSupplier,
      formError,
      formErrors,
      openAddSupplier,
      openEditSupplier,
      submitSupplierForm,
      deleteSupplierHandler,
      showDetail,
      // Phân trang
      handlePrev,
      handleNext,
      handlePageSizeChange,
      // Toggle status
      handleStatusChange,
      // Fake data and modal
      fillFakeData,
      closeModal,
    };
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

/* Enhanced Modal Styles */
.modal-lg {
  max-width: 900px !important;
}

.modal-dialog-scrollable {
  max-height: 90vh;
}

.modal-dialog-scrollable .modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.enhanced-modal {
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

.gradient-header {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border-bottom: none;
  border-radius: 15px 15px 0 0;
  padding: 1rem 1.25rem;
  position: relative;
}

.gradient-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  background-size: 300% 100%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.modal-title {
  font-weight: 600;
  color: #2c2c54;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.enhanced-body {
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.enhanced-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 0.875rem 1.25rem;
  border-radius: 0 0 15px 15px;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 1.75rem;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #ecae9e;
  position: relative;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.form-section:nth-child(1) {
  border-left-color: #ecae9e;
}

.form-section:nth-child(2) {
  border-left-color: #4ecdc4;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f3f4;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, #ecae9e, #4ecdc4);
  border-radius: 1px;
}

.section-icon {
  font-size: 1rem;
  color: #ecae9e;
  margin-right: 0.5rem;
  padding: 0.4rem;
  background: rgba(236, 174, 158, 0.1);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  margin: 0;
  font-weight: 600;
  color: #2c2c54;
  font-size: 0.95rem;
}

/* Enhanced Form Controls */
.enhanced-label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #495057;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.enhanced-label .text-danger {
  margin-left: 0.25rem;
}

.enhanced-input {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

.enhanced-input:focus {
  border-color: #ecae9e;
  box-shadow: 0 0 0 0.15rem rgba(236, 174, 158, 0.25);
  background: #ffffff;
}

.enhanced-input:hover {
  border-color: #d49489;
}

/* Button Styles */
.fake-data-btn {
  background: linear-gradient(135deg, #feca57 0%, #ff9f43 100%);
  border: none;
  color: #2c2c54;
  font-weight: 600;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(254, 202, 87, 0.3);
}

.fake-data-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(254, 202, 87, 0.4);
  background: linear-gradient(135deg, #ff9f43 0%, #feca57 100%);
  color: #2c2c54;
}

.btn-submit {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  border: none;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(236, 174, 158, 0.3);
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(236, 174, 158, 0.4);
  background: linear-gradient(135deg, #d49489 0%, #c08579 100%);
}

.btn-cancel {
  border: 1px solid #6c757d;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: transparent;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-1px);
}

.custom-close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 0.6rem;
  cursor: pointer;
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2c2c54;
  transition: all 0.3s ease;
}

.custom-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

/* Table and Status Styling */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Sweet alert supplier detail styling */
:deep(.supplier-detail-container) {
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.swal-supplier-detail) {
  text-align: left;
}

:deep(.swal-supplier-detail .table) {
  margin-bottom: 0;
}

:deep(.swal-supplier-detail th) {
  background-color: #f8f9fa;
}

/* Animation for form sections */
.form-section {
  animation: slideInUp 0.4s ease-out;
}

.form-section:nth-child(1) {
  animation-delay: 0s;
}

.form-section:nth-child(2) {
  animation-delay: 0.1s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal positioning fix */
.modal-dialog {
  margin: 1rem auto;
  display: flex;
  align-items: flex-start;
  min-height: calc(100vh - 2rem);
}

@media (min-height: 600px) {
  .modal-dialog {
    align-items: center;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-lg {
    max-width: 95% !important;
  }
  
  .form-section {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
}
</style>
