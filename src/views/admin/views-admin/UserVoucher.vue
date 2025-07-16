<template>
  <div class="container-fluid py-4">
    <!-- Bộ lọc -->
    <div class="bg-light p-3 rounded mb-4 border pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <i class="bi bi-funnel-fill me-2 text-dark"></i>
        <h5 class="mb-0">Bộ lọc</h5>
      </div>
      <div class="row g-3 m-2 mt-0 p-0 align-items-end">
        <div class="col-md-6">
          <label class="form-label mb-1">Tìm kiếm theo tên</label>
          <input
            type="text"
            class="form-control"
            placeholder="Nhập tên người dùng"
            v-model="searchName"
            @input="onFilterChange"
          />
        </div>
        <div class="col-12 d-flex justify-content-end">
          <button
            class="btn btn-secondary btn-sm"
            type="button"
            @click="resetFilter"
          >
            Hủy lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách user nhận voucher -->
    <div class="bg-white p-3 rounded shadow-sm pt-0 ps-0 pe-0">
      <div
        class="d-flex align-items-center mb-3 p-2 m-0 rounded-top"
        style="background-color: #ecae9e"
      >
        <strong>Danh sách người dùng nhận voucher</strong>
      </div>
      <!-- Nút thêm -->
      <div class="mb-3">
        <button class="btn btn-success" @click="openAddForm">
          <i class="bi bi-plus-circle me-1"></i> Thêm user voucher
        </button>
      </div>

      <!-- Modal Thêm User Voucher -->
      <div v-if="showAddForm" class="modal-backdrop">
        <div class="modal-dialog" style="max-width: 500px">
          <div class="modal-content bg-white shadow rounded-4">
            <div
              class="modal-header py-3 px-4"
              style="
                background: #f7c6b7;
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
              "
            >
              <h5 class="modal-title fw-bold text-dark">Thêm user voucher</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeAddForm"
              ></button>
            </div>
            <form @submit.prevent="submitAddForm">
              <div class="modal-body px-4 py-3">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label mb-1 text-secondary small"
                      >User ID <span class="text-danger">*</span></label
                    >
                    <input
                      type="number"
                      class="form-control rounded-3"
                      v-model="addForm.userId"
                      required
                      placeholder="Nhập User ID"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label mb-1 text-secondary small"
                      >Voucher ID</label
                    >
                    <input
                      type="number"
                      class="form-control rounded-3"
                      v-model="addForm.voucherId"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer justify-content-end px-4 pb-3 border-0">
                <button
                  type="button"
                  class="btn btn-outline-secondary rounded-pill px-4"
                  @click="closeAddForm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="btn btn-primary rounded-pill ms-2 px-4"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="p-3">
        <table class="table align-middle text-center">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Mã voucher</th>
              <th>Số lần dùng</th>
              <th>Ngày nhận</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="6" class="py-4 text-center">
                <div
                  class="spinner-border text-primary me-2"
                  role="status"
                  style="width: 2rem; height: 2rem"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td :colspan="6" class="py-4 text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
            <tr v-else v-for="(user, index) in paginatedUsers" :key="user.id">
              <td>{{ currentPage * pageSize + index + 1 }}</td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.voucherCode }}</td>
              <td>{{ user.usedCount }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="d-flex justify-content-end align-items-center mb-2">
        <button
          class="btn btn-outline-secondary btn-sm me-2"
          :disabled="currentPage === 0"
          @click="prevPage"
        >
          Trước
        </button>
        <span>Trang {{ currentPage + 1 }} / {{ totalPages }}</span>
        <button
          class="btn btn-outline-secondary btn-sm ms-2"
          :disabled="currentPage >= totalPages - 1"
          @click="nextPage"
        >
          Sau
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getUsersByVoucherId } from "@/services/admin/voucher";
import { addVoucherForNewuser } from "@/services/client/userVoucher";

export default {
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const users = ref([]);
    const loading = ref(false);
    const searchName = ref("");
    const pageSize = ref(10);
    const currentPage = ref(0);

    // Modal state
    const showAddForm = ref(false);
    const addForm = ref({
      userId: "",
      voucherId: props.id,
    });

    // Lấy voucherId từ props
    const voucherId = Number(props.id);

    onMounted(async () => {
      loading.value = true;
      try {
        const res = await getUsersByVoucherId(voucherId);
        users.value = res;
      } catch (error) {
        users.value = [];
      } finally {
        loading.value = false;
      }
    });

    // Lọc theo tên người dùng
    const filteredUsers = computed(() => {
      if (!searchName.value) return users.value;
      return users.value.filter((u) =>
        u.fullName.toLowerCase().includes(searchName.value.toLowerCase())
      );
    });

    // Phân trang
    const totalPages = computed(() =>
      Math.ceil(filteredUsers.value.length / pageSize.value)
    );
    const paginatedUsers = computed(() =>
      filteredUsers.value.slice(
        currentPage.value * pageSize.value,
        (currentPage.value + 1) * pageSize.value
      )
    );

    function prevPage() {
      if (currentPage.value > 0) currentPage.value--;
    }
    function nextPage() {
      if (currentPage.value < totalPages.value - 1) currentPage.value++;
    }
    function onFilterChange() {
      currentPage.value = 0;
    }
    function resetFilter() {
      searchName.value = "";
      currentPage.value = 0;
    }
    function formatDate(ts) {
      if (!ts) return "";
      const d = new Date(ts);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Modal handlers
    function openAddForm() {
      addForm.value = {
        userId: "",
        voucherId: props.id,
        usedCount: 0,
      };
      showAddForm.value = true;
    }
    function closeAddForm() {
      showAddForm.value = false;
    }
    async function submitAddForm() {
      try {
        await addVoucherForNewuser(addForm.value);
        showAddForm.value = false;
        // Reload data
        loading.value = true;
        const res = await getUsersByVoucherId(voucherId);
        users.value = res;
      } catch (error) {
        alert("Thêm thất bại!");
      } finally {
        loading.value = false;
      }
    }

    return {
      users,
      loading,
      searchName,
      pageSize,
      currentPage,
      totalPages,
      paginatedUsers,
      filteredUsers,
      prevPage,
      nextPage,
      onFilterChange,
      resetFilter,
      formatDate,
      showAddForm,
      addForm,
      openAddForm,
      closeAddForm,
      submitAddForm,
      id: props.id,
    };
  },
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dialog {
  max-width: 500px;
  width: 100%;
}
</style>
