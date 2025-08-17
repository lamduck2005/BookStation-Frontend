<template>
  <div class="admin-page container-fluid py-4">
    <!-- ========== THỐNG KÊ TỔNG QUAN VOUCHER ========== -->
    <OverviewStatsComponent :stats="stats" />

    <!-- ========== BỘ LỌC VOUCHER ========== -->
    <div class="card mb-5 shadow-lg border-0 filter-card">
      <div class="card-header bg-light border-0 py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-funnel me-2"></i>
            Bộ lọc tìm kiếm
          </h5>
          <button
            class="btn btn-sm btn-outline-secondary"
            type="button"
            @click="toggleFilter"
            :aria-expanded="showFilter"
          >
            <i
              :class="showFilter ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
            ></i>
            {{ showFilter ? "Thu gọn" : "Mở rộng" }}
          </button>
        </div>
      </div>
      <div
        class="card-body filter-collapse"
        :class="{ 'filter-collapsed': !showFilter }"
      >
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-search me-1"></i>
              Tìm kiếm mã voucher
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập mã voucher..."
              v-model="searchQuery"
              @input="onFilterChange"
            />
          </div>
          <!-- ✅ BỎ dropdown trạng thái -->
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-card-text me-1"></i>
              Tên voucher
            </label>
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tên voucher..."
              v-model="nameFilter"
              @input="onFilterChange"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-tag me-1"></i>
              Loại voucher
            </label>
            <select
              class="form-select"
              v-model="voucherTypeFilter"
              @change="onFilterChange"
            >
              <option value="">Tất cả loại</option>
              <option value="PERCENTAGE">Phần trăm</option>
              <option value="FIXED_AMOUNT">Số tiền</option>
            </select>
          </div>
        </div>
        <div class="row g-3 pt-3 d-flex justify-content-center">
          <div class="col-md-1">
            <button class="btn btn-success w-100 me-2" @click="onFilterChange">
              <i class="bi bi-funnel"></i> Lọc
            </button>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="resetFilter">
              <i class="bi bi-x-circle me-1"></i> Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================== BẢNG DANH SÁCH VOUCHER ================== -->
    <div class="card shadow-lg border-0 mb-4 admin-table-card">
      <div
        class="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3"
      >
        <div>
          <h5 class="mb-0 text-secondary">
            <i class="bi bi-ticket-perforated me-2"></i>
            Danh sách voucher
          </h5>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-info btn-sm py-2"
            @click="fetchVouchers"
            :disabled="loading"
          >
            <i class="bi bi-arrow-repeat me-1"></i> Làm mới
          </button>
          <button
            class="btn btn-primary btn-sm py-2"
            style="background-color: #33304e; border-color: #33304e"
            @click="openAddVoucher"
          >
            <i class="bi bi-plus-circle me-1"></i> Thêm mới
          </button>
        </div>
      </div>
      <div class="card-body p-0 position-relative">
        <!-- Loading overlay -->
        <div class="loading-overlay" :class="{ show: loading }">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Data table -->
        <div v-if="!loading">
          <table class="table align-middle table-hover mb-0">
            <thead>
              <tr>
                <th style="width: 40px">STT</th>
                <th style="width: 180px">MÃ VOUCHER</th>
                <th style="width: 250px">TÊN VOUCHER</th>
                <th style="width: 150px">NGÀY BẮT ĐẦU</th>
                <th style="width: 150px">NGÀY KẾT THÚC</th>
                <!-- ✅ BỎ cột TRẠNG THÁI -->
                <th style="width: 120px">LƯỢT DÙNG</th>
                <th style="width: 150px">CHỨC NĂNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="listVoucher.length === 0">
                <!-- ✅ Giảm colspan từ 8 xuống 7 -->
                <td colspan="7" class="text-center py-4 text-muted">
                  <i class="bi bi-inbox me-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr
                v-else
                v-for="(voucher, index) in listVoucher"
                :key="voucher.id"
                @click="showDetail(voucher)"
                class="cursor-pointer align-middle"
              >
                <td class="py-3">{{ currentPage * pageSize + index + 1 }}</td>
                <td class="py-3 fw-bold" @click.stop>
                  <router-link
                    :to="`/admin/userVoucher/${voucher.id}`"
                    class="text-decoration-none"
                  >
                    {{ voucher.code }}
                  </router-link>
                </td>
                <td class="py-3">
                  <div class="voucher-name-cell">
                    <span class="voucher-name" :title="voucher.name">
                      {{ voucher.name || "Chưa có tên" }}
                    </span>
                    <small
                      class="text-muted d-block mt-1"
                      v-if="voucher.voucherCategory"
                    >
                      {{
                        voucher.voucherCategory === "NORMAL"
                          ? "Thường"
                          : voucher.voucherCategory === "SHIPPING"
                          ? "Ship"
                          : voucher.voucherCategory
                      }}
                    </small>
                  </div>
                </td>
                <td class="py-3">{{ voucher.start_time }}</td>
                <td class="py-3">{{ voucher.end_time }}</td>
                <!-- ✅ BỎ cột trạng thái với ToggleStatus -->
                <td class="py-3">
                  <span
                    v-if="voucher.soLanDungConLai > 0"
                    class="badge bg-success"
                  >
                    {{ voucher.soLanDungConLai }}
                  </span>
                  <span v-else class="badge bg-danger">Hết lượt</span>
                </td>
                <td class="py-3">
                  <div @click.stop class="d-flex gap-2">
                    <span class="tooltip-wrapper">
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="showDetail(voucher)"
                      >
                        <i class="bi bi-eye"></i>
                      </button>
                      <span class="tooltip-bubble">Xem chi tiết</span>
                    </span>
                    <span class="tooltip-wrapper">
                      <EditButton
                        :tooltip="'Cập nhật voucher ' + voucher.code"
                        @click="openEditVoucher(voucher)"
                      />
                      <span class="tooltip-bubble">Chỉnh sửa</span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="p-3">
          <Pagination
            :page-number="currentPage"
            :total-pages="totalPages"
            :is-last-page="isLastPage"
            :page-size="pageSize"
            :items-per-page-options="itemsPerPageOptions"
            :total-elements="totalElements"
            @prev="prevPage"
            @next="nextPage"
            @update:pageSize="handlePageSizeChange"
          />
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Cập nhật Voucher -->
    <div
      v-if="showFormModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.2); z-index: 1050"
    >
      <div class="modal-dialog modal-dialog-centered" style="max-width: 800px">
        <div class="modal-content">
          <div class="modal-header author-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              {{ isEdit ? "Cập nhật voucher" : "Thêm voucher mới" }}
            </h5>
            <button
              type="button"
              class="custom-close-btn"
              @click="closeFormModal"
              aria-label="Đóng"
              title="Đóng"
            >
              <i class="bx bx-x-circle"></i>
            </button>
          </div>
          <div class="modal-body author-modal-body">
            <form @submit.prevent="submitVoucher">
              <div class="row">
                <div class="mb-2 col-6">
                  <label class="form-label">
                    Mã voucher <span style="color: red">*</span>
                  </label>
                  <input
                    v-model="formVoucher.code"
                    class="form-control"
                    placeholder="Nhập mã voucher"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    Tên voucher <span style="color: red">*</span>
                  </label>
                  <input
                    v-model="formVoucher.name"
                    class="form-control"
                    placeholder="Nhập tên voucher"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    Loại voucher <span style="color: red">*</span>
                    <!-- ✅ Thêm text cho biết không thể sửa -->
                    <small v-if="isEdit" class="text-muted ms-2"
                      >(Không thể thay đổi)</small
                    >
                  </label>
                  <select
                    v-model="formVoucher.voucherCategory"
                    class="form-select"
                    :class="{ 'bg-light': isEdit }"
                    :disabled="isEdit"
                    required
                  >
                    <option value="">Chọn loại voucher</option>
                    <option value="NORMAL">Thường</option>
                    <option value="SHIPPING">Giảm Giá SHIPPING</option>
                  </select>
                  <!-- ✅ Thêm thông báo dưới dropdown -->
                  <div v-if="isEdit" class="form-text text-warning">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Loại voucher không thể thay đổi sau khi tạo
                  </div>
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    Kiểu giảm giá <span style="color: red">*</span>
                  </label>
                  <select
                    v-model="formVoucher.discountType"
                    class="form-select"
                    required
                  >
                    <option value="">Chọn kiểu giảm giá</option>
                    <option value="PERCENTAGE">Phần trăm</option>
                    <option value="FIXED_AMOUNT">Số tiền</option>
                  </select>
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Phần trăm giảm (%)
                  </label>
                  <input
                    v-model="formVoucher.discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    class="form-control"
                    :disabled="formVoucher.discountType !== 'PERCENTAGE'"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Số tiền giảm
                  </label>
                  <input
                    v-model="formVoucher.discountAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control"
                    :disabled="formVoucher.discountType !== 'FIXED_AMOUNT'"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Ngày bắt đầu
                  </label>
                  <input
                    v-model="formVoucher.startTime"
                    type="datetime-local"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Ngày kết thúc
                  </label>
                  <input
                    v-model="formVoucher.endTime"
                    type="datetime-local"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Giá trị đơn tối thiểu
                  </label>
                  <input
                    v-model="formVoucher.minOrderValue"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control"
                    required
                  />
                </div>
                <div
                  class="mb-2 col-6"
                  v-if="formVoucher.discountType === 'PERCENTAGE'"
                >
                  <label class="form-label">
                    <span style="color: red">*</span> Giá trị giảm tối đa
                  </label>
                  <input
                    v-model="formVoucher.maxDiscountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    class="form-control"
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Giới hạn lượt dùng
                  </label>
                  <input
                    v-model="formVoucher.usageLimit"
                    type="number"
                    min="0"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-6">
                  <label class="form-label">
                    <span style="color: red">*</span> Giới hạn/người
                  </label>
                  <input
                    v-model="formVoucher.usageLimitPerUser"
                    type="number"
                    min="0"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-2 col-12">
                  <label class="form-label">Mô tả</label>
                  <textarea
                    v-model="formVoucher.description"
                    class="form-control"
                    rows="2"
                    placeholder="Nhập mô tả voucher"
                    maxlength="500"
                  ></textarea>
                  <div class="form-text">
                    {{
                      formVoucher.description
                        ? formVoucher.description.length
                        : 0
                    }}/500 ký tự
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeFormModal"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              style="background-color: #33304e; border-color: #33304e"
              @click="submitVoucher"
            >
              {{ isEdit ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditButton from "@/components/common/EditButton.vue";
import DeleteButton from "@/components/common/DeleteButton.vue";
// ✅ BỎ import ToggleStatus
// import ToggleStatus from "@/components/common/ToggleStatus.vue";
import Pagination from "@/components/common/Pagination.vue";
import OverviewStatsComponent from "@/components/common/OverviewStatsComponent.vue";
import { getUserId, getUserFullName } from "@/utils/utils";
import { Modal } from "bootstrap";
import { ref, computed, watch, onMounted } from "vue";
import {
  getVouchers,
  createVouchers,
  updateVouchers,
  deleteVouchers,
  // ✅ BỎ import upStatusVouchers
  // upStatusVouchers,
  getVoucherStats,
} from "@/services/admin/voucher";
import Swal from "sweetalert2";
import { showToast } from "@/utils/swalHelper";

export default {
  components: {
    Pagination,
    EditButton,
    DeleteButton,
    // ✅ BỎ ToggleStatus khỏi components
    // ToggleStatus,
    OverviewStatsComponent,
    showToast,
  },
  setup() {
    const currentPage = ref(0);
    const pageSize = ref(10);
    const totalElements = ref(0);
    const totalPages = ref(1);
    const isLastPage = computed(
      () => currentPage.value >= totalPages.value - 1
    );
    const voucherChannel = new BroadcastChannel("voucher-status");

    const itemsPerPageOptions = ref([5, 10, 20, 50]);

    const listVoucher = ref([]);

    const searchQuery = ref("");
    // ✅ BỎ statusFilter
    // const statusFilter = ref("");
    const nameFilter = ref("");
    const voucherTypeFilter = ref("");
    const showDetailModal = ref(false);
    const selectedVoucher = ref(null);
    const showFormModal = ref(false);
    const isEdit = ref(false);
    const formVoucher = ref({
      id: null,
      code: "",
      name: "",
      description: "",
      voucherCategory: "",
      discountType: "",
      discountPercentage: "",
      discountAmount: "",
      startTime: "",
      endTime: "",
      minOrderValue: "",
      maxDiscountValue: "",
      usageLimit: "",
      usedCount: "",
      usageLimitPerUser: "",
      // ✅ BỎ status khỏi form
      // status: 1,
      createdBy: "",
      updatedBy: "",
    });
    const loading = ref(false);
    const showFilter = ref(false);

    // ✅ Stats khởi tạo với giá trị mặc định
    const stats = ref([
      { label: "Tổng số voucher", value: 0 },
      { label: "Voucher đang hoạt động", value: 0 },
      { label: "Lượt sử dụng voucher", value: 0 },
      { label: "Voucher phổ biến nhất", value: "—" },
    ]);

    // ✅ Function fetch stats từ API thật - khớp với response structure
    const fetchStats = async () => {
      try {
        console.log("🔄 Đang tải thống kê voucher...");
        const response = await getVoucherStats();
        console.log("📊 Response stats:", response);

        // ✅ Sửa để khớp với cấu trúc API response thật
        const data = response.data; // Lấy trực tiếp data từ response

        stats.value = [
          { label: "Tổng số voucher", value: data.totalVouchers || 0 },
          { label: "Voucher đang hoạt động", value: data.activeVouchers || 0 },
          { label: "Lượt sử dụng voucher", value: data.totalUsageCount || 0 },
          {
            label: "Voucher phổ biến nhất",
            value: data.mostPopularVoucher || "—",
          },
        ];

        console.log("✅ Stats đã cập nhật:", stats.value);
      } catch (error) {
        console.error("❌ Lỗi khi tải thống kê voucher:", error);

        // ✅ Fallback với data fake khi có lỗi
        stats.value = [
          { label: "Tổng số voucher", value: 25 },
          { label: "Voucher đang hoạt động", value: 18 },
          { label: "Lượt sử dụng voucher", value: 342 },
          { label: "Voucher phổ biến nhất", value: "SUMMER2024" },
        ];

        showToast("warning", "Không thể tải thống kê, hiển thị dữ liệu mẫu");
      }
    };

    // Thêm toggle filter function
    const toggleFilter = () => {
      showFilter.value = !showFilter.value;
    };

    onMounted(() => {
      console.log("🚀 Component mounted, loading data...");
      fetchStats(); // ✅ Gọi stats khi component mount
      fetchVouchers();
    });

    async function fetchVouchers() {
      loading.value = true;
      try {
        const res = await getVouchers({
          page: currentPage.value,
          size: pageSize.value,
          code: searchQuery.value || null,
          name: nameFilter.value || null,
          voucherType: voucherTypeFilter.value || null,
          // ✅ BỎ status filter
          // status:
          //   statusFilter.value === ""
          //     ? null
          //     : statusFilter.value === "Hoạt động"
          //     ? 1
          //     : 0,
        });

        listVoucher.value = res.content.map((voucher) => ({
          id: voucher.id,
          code: voucher.code,
          name: voucher.name,
          description: voucher.description,
          voucherCategory: voucher.voucherCategory,
          discountType: voucher.discountType,
          discountPercentage: voucher.discountPercentage,
          discountAmount: voucher.discountAmount,
          start_time: formatDate(voucher.startTime),
          end_time: formatDate(voucher.endTime),
          startTime: voucher.startTime,
          endTime: voucher.endTime,
          minOrderValue: voucher.minOrderValue,
          maxDiscountValue: voucher.maxDiscountValue,
          usageLimit: voucher.usageLimit,
          usedCount: voucher.usedCount,
          usageLimitPerUser: voucher.usageLimitPerUser,
          // ✅ BỎ status
          // status: voucher.status,
          createdBy: voucher.createdBy,
          updatedBy: voucher.updatedBy,
          // Tính số lần dùng còn lại
          soLanDungConLai: Math.max(voucher.usageLimit - voucher.usedCount, 0),
        }));

        totalElements.value = res.totalElements;
        totalPages.value = res.totalPages;

        // ✅ Cập nhật lại stats sau khi fetch vouchers
        await fetchStats();
      } catch (error) {
        console.error("Lỗi khi tải voucher:", error);
      } finally {
        loading.value = false;
      }
    }

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    watch([currentPage, pageSize], () => {
      fetchVouchers();
    });

    function onFilterChange() {
      currentPage.value = 0;
      fetchVouchers();
    }

    function prevPage() {
      if (currentPage.value > 0) currentPage.value--;
    }

    function nextPage() {
      if (currentPage.value < totalPages.value - 1) currentPage.value++;
    }

    function handlePageSizeChange(newSize) {
      pageSize.value = newSize;
      currentPage.value = 0;
    }

    function showDetail(voucher) {
      Swal.fire({
        title: `Chi tiết voucher: ${voucher.name ?? "Trống"}`,
        html: `
          <div style="max-height:400px;overflow:auto">
            <table class="table table-bordered text-start">
              <tr><th>Mã</th><td>${voucher.code ?? "Trống"}</td></tr>
              <tr><th>Tên</th><td>${voucher.name ?? "Trống"}</td></tr>
              <tr><th>Mô tả</th><td>${voucher.description ?? "Trống"}</td></tr>
             <tr><th>Loại</th><td>${
               voucher.voucherCategory === "NORMAL"
                 ? "Thường"
                 : voucher.voucherCategory === "SHIPPING"
                 ? "Giảm Giá SHIPPING"
                 : "Trống"
             }</td></tr>
<tr><th>Kiểu giảm giá</th><td>${
          voucher.discountType === "PERCENTAGE"
            ? "Phần trăm"
            : voucher.discountType === "FIXED_AMOUNT"
            ? "Số tiền"
            : "Trống"
        }</td></tr>

              <tr><th>Phần trăm giảm</th><td>${
                voucher.discountPercentage ?? "0"
              }</td></tr>
              <tr><th>Số tiền giảm</th><td>${
                voucher.discountAmount ?? "0"
              }</td></tr>
              <tr><th>Bắt đầu</th><td>${voucher.start_time ?? "Trống"}</td></tr>
              <tr><th>Kết thúc</th><td>${voucher.end_time ?? "Trống"}</td></tr>
              <tr><th>Đơn tối thiểu</th><td>${
                voucher.minOrderValue ?? "0"
              }</td></tr>
              <tr><th>Giảm tối đa</th><td>${
                voucher.maxDiscountValue ?? "0"
              }</td></tr>
              <tr><th>Giới hạn lượt dùng</th><td>${
                voucher.usageLimit ?? "0"
              }</td></tr>
              <tr><th>Đã dùng</th><td>${voucher.usedCount ?? "0"}</td></tr>
              <tr><th>Giới hạn/người</th><td>${
                voucher.usageLimitPerUser ?? "0"
              }</td></tr>
              <tr><th>Người tạo</th><td>${
                voucher.createdBy ?? "Trống"
              }</td></tr>
              <tr><th>Người cập nhật</th><td>${
                voucher.updatedBy ?? "Trống"
              }</td></tr>
            </table>
          </div>
        `,
        width: 600,
        confirmButtonText: "Đóng",
      });
    }

    function closeDetailModal() {
      showDetailModal.value = false;
      selectedVoucher.value = null;
    }

    function openAddVoucher() {
      isEdit.value = false;
      formVoucher.value = {
        id: null,
        code: "",
        name: "",
        description: "",
        voucherCategory: "",
        discountType: "",
        discountPercentage: "",
        discountAmount: "",
        startTime: "",
        endTime: "",
        minOrderValue: "",
        maxDiscountValue: "",
        usageLimit: "",
        usedCount: "",
        usageLimitPerUser: "",
        // ✅ BỎ status
        // status: 1,
        createdBy: getUserFullName(),
        updatedBy: "",
      };
      showFormModal.value = true;
    }

    // Thêm mới hoặc cập nhật voucher
    async function submitVoucher() {
      formVoucher.value.code = formVoucher.value.code.trim();

      // Validate rỗng
      if (
        !formVoucher.value.code ||
        !formVoucher.value.voucherCategory ||
        !formVoucher.value.discountType ||
        !formVoucher.value.startTime ||
        !formVoucher.value.endTime ||
        formVoucher.value.minOrderValue === "" ||
        !formVoucher.value.createdBy
      ) {
        showToast("error", "Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      const codeExists = listVoucher.value.some((v) => {
        const currentCode = formVoucher.value.code.trim().toLowerCase();
        const voucherCode = v.code.trim().toLowerCase();
        const sameCode = voucherCode === currentCode;
        const isDifferentId = isEdit.value
          ? v.id !== formVoucher.value.id
          : true;
        return sameCode && isDifferentId;
      });

      if (codeExists) {
        showToast("error", "Mã voucher đã tồn tại trong hệ thống!");
        return;
      }

      // Validate số
      if (
        formVoucher.value.discountType === "PERCENTAGE" &&
        (isNaN(formVoucher.value.discountPercentage) ||
          formVoucher.value.discountPercentage < 1 ||
          formVoucher.value.discountPercentage > 100)
      ) {
        showToast("error", "Phần trăm giảm phải từ 1 đến 100!");
        return;
      }
      if (
        formVoucher.value.discountType === "FIXED_AMOUNT" &&
        (isNaN(formVoucher.value.discountAmount) ||
          Number(formVoucher.value.discountAmount) < 1)
      ) {
        showToast("error", "Số tiền giảm phải lớn hơn 0!");
        return;
      }
      if (
        formVoucher.value.minOrderValue !== "" &&
        (isNaN(formVoucher.value.minOrderValue) ||
          Number(formVoucher.value.minOrderValue) < 0)
      ) {
        showToast("error", "Giá trị đơn tối thiểu phải >= 0!");
        return;
      }
      if (
        formVoucher.value.maxDiscountValue !== "" &&
        (isNaN(formVoucher.value.maxDiscountValue) ||
          Number(formVoucher.value.maxDiscountValue) < 0)
      ) {
        showToast("error", "Giá trị giảm tối đa phải >= 0!");
        return;
      }

      // Validate ngày
      const start = new Date(formVoucher.value.startTime);
      const end = new Date(formVoucher.value.endTime);
      if (end <= start) {
        showToast("error", "Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }

      // Helper chuyển đổi
      const toNumberOrNull = (val) =>
        val === "" || val === null || typeof val === "undefined"
          ? null
          : Number(val);

      const toStringOrNull = (val) =>
        val === "" || typeof val === "undefined" ? null : val;

      const toTimestampOrNull = (val) =>
        val === "" || val === null || typeof val === "undefined"
          ? null
          : new Date(val).getTime();

      const payload = {
        code: formVoucher.value.code,
        name: toStringOrNull(formVoucher.value.name),
        description: toStringOrNull(formVoucher.value.description),
        voucherCategory: formVoucher.value.voucherCategory,
        discountType: formVoucher.value.discountType,
        discountPercentage: toNumberOrNull(
          formVoucher.value.discountPercentage
        ),
        discountAmount: toNumberOrNull(formVoucher.value.discountAmount),
        startTime: toTimestampOrNull(formVoucher.value.startTime),
        endTime: toTimestampOrNull(formVoucher.value.endTime),
        minOrderValue: toNumberOrNull(formVoucher.value.minOrderValue),
        maxDiscountValue: toNumberOrNull(formVoucher.value.maxDiscountValue),
        usageLimit: toNumberOrNull(formVoucher.value.usageLimit),
        usedCount: toNumberOrNull(formVoucher.value.usedCount),
        usageLimitPerUser: toNumberOrNull(formVoucher.value.usageLimitPerUser),
        createdBy: formVoucher.value.createdBy,
        updatedBy: getUserFullName(),
      };

      if (isEdit.value) {
        payload.id = formVoucher.value.id;
        // ✅ Khi sửa, không gửi voucherCategory để đảm bảo backend không thay đổi
        // Tùy vào logic backend, có thể bỏ dòng này hoặc giữ lại
        // delete payload.voucherCategory;
      }

      try {
        if (payload.discountType === "FIXED_AMOUNT") {
          payload.maxDiscountValue = 0;
        }
        if (isEdit.value) {
          await updateVouchers(payload);
          voucherChannel.postMessage("updated");
          showToast("success", "Cập nhật voucher thành công!");
        } else {
          await createVouchers(payload);
          showToast("success", "Thêm voucher thành công!");
        }
        closeFormModal();
        await fetchVouchers();
      } catch (error) {
        let msg = "Có lỗi xảy ra!";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          msg = error.response.data.message;
        }
        showToast("error", msg);
      }
    }

    // ✅ BỎ function toggleStatus
    // async function toggleStatus(voucher, newStatus) {
    //   try {
    //     await upStatusVouchers(
    //       voucher.id,
    //       newStatus,
    //       voucher.createdBy || "getUserFullName()"
    //     );
    //     voucherChannel.postMessage("updated");
    //     showToast("success", "Cập nhật trạng thái thành công!");
    //     await fetchVouchers();
    //   } catch (error) {
    //     showToast("error", "Cập nhật trạng thái thất bại!");
    //   }
    // }

    // Khi click Sửa voucher
    function openEditVoucher(voucher) {
      isEdit.value = true;

      function toInputDate(val) {
        if (!val) return "";
        const d = new Date(val);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 16);
      }

      formVoucher.value = {
        id: voucher.id,
        code: voucher.code,
        name: voucher.name,
        description: voucher.description,
        voucherCategory: voucher.voucherCategory,
        discountType: voucher.discountType,
        discountPercentage: voucher.discountPercentage,
        discountAmount: voucher.discountAmount,
        startTime: toInputDate(voucher.startTime),
        endTime: toInputDate(voucher.endTime),
        minOrderValue: voucher.minOrderValue,
        maxDiscountValue: voucher.maxDiscountValue,
        usageLimit: voucher.usageLimit,
        usedCount: voucher.usedCount,
        usageLimitPerUser: voucher.usageLimitPerUser,
        // ✅ BỎ status khỏi edit form
        // status: voucher.status,
        createdBy: voucher.createdBy || "admin",
        updatedBy: voucher.updatedBy || "admin",
      };
      showFormModal.value = true;
    }

    function closeFormModal() {
      showFormModal.value = false;
    }

    // Watch voucherType để reset trường còn lại về 0
    watch(
      () => formVoucher.value.voucherType,
      (newType) => {
        if (newType === "PERCENTAGE") {
          formVoucher.value.discountAmount = 0;
        } else if (newType === "FIXED_AMOUNT") {
          formVoucher.value.discountPercentage = 0;
        }
      }
    );

    function resetFilter() {
      searchQuery.value = "";
      // ✅ BỎ reset statusFilter
      // statusFilter.value = "";
      nameFilter.value = "";
      voucherTypeFilter.value = "";
      currentPage.value = 0;
      fetchVouchers();
    }

    return {
      currentPage,
      pageSize,
      totalPages,
      totalElements,
      isLastPage,
      itemsPerPageOptions,
      listVoucher,
      searchQuery,
      // ✅ BỎ statusFilter khỏi return
      // statusFilter,
      nameFilter,
      voucherTypeFilter,
      onFilterChange,
      prevPage,
      nextPage,
      handlePageSizeChange,
      showDetail,
      closeDetailModal,
      openAddVoucher,
      openEditVoucher,
      // ✅ BỎ toggleStatus khỏi return
      // toggleStatus,
      showDetailModal,
      selectedVoucher,
      showFormModal,
      isEdit,
      formVoucher,
      closeFormModal,
      submitVoucher,
      resetFilter,
      loading,
      showFilter,
      toggleFilter,
      fetchVouchers,
      stats,
      fetchStats,
    };
  },
};
</script>

<style scoped>
@import "@/assets/css/admin-global.css";

/* Chỉ giữ lại style cho modal và phần riêng */
.modal-dialog {
  max-width: 800px !important;
}

.modal-content {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: none;
  max-height: calc(70vh + 150px);
  overflow: hidden;
}

.author-modal-header {
  border-bottom: 2px solid #ecae9e;
  border-radius: 15px 15px 0 0;
  padding: 0.8rem 1.2rem;
  position: relative;
  background: #f8fafc;
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
  font-size: 1.5rem;
  color: #333;
}

.author-modal-body {
  min-height: 320px;
  max-height: calc(45vh + 150px);
  overflow-y: auto;
  padding: 1.5rem 1.2rem 0.5rem 1.2rem;
}

.modal-footer {
  border-top: none;
  background: none;
  padding: 1rem 0 0 0;
  justify-content: flex-end;
}

.cursor-pointer {
  cursor: pointer;
}

/* Style cho cột tên voucher */
.voucher-name-cell {
  max-width: 250px; /* ✅ Tăng từ 200px lên 250px vì bỏ cột trạng thái */
}

.voucher-name {
  display: block;
  font-weight: 500;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.voucher-name-cell small {
  font-size: 0.75rem;
  font-weight: 400;
  color: #6c757d !important;
}

/* ✅ Style cho disabled select */
.form-select:disabled,
.form-select.bg-light {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed !important;
  border-color: #dee2e6 !important;
}

.form-select:disabled option {
  color: #6c757d !important;
}

/* Style cho text warning */
.form-text.text-warning {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1200px) {
  .voucher-name-cell {
    max-width: 200px;
  }
}

@media (max-width: 900px) {
  .modal-dialog {
    max-width: 98vw !important;
  }
  .modal-content {
    max-height: 80vh;
  }
  .author-modal-body {
    max-height: 60vh;
  }

  /* Ẩn một số cột trên mobile */
  .table th:nth-child(4),
  .table td:nth-child(4) {
    display: none;
  }

  .voucher-name-cell {
    max-width: 150px;
  }
}
</style>
