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
      <div class="mb-3" >
        <button class="btn btn-success" @click="openAddForm">
          <i class="bi bi-plus-circle me-1"></i> Thêm user voucher
        </button>
              <!-- Nút phát nhanh -->
  <button
    class="btn btn-warning"
    @click="confirmGiveAll"
    :disabled="givingAll"
    style="margin-left: 10px;"
  >
    <span v-if="givingAll" class="spinner-border spinner-border-sm me-2"></span>
    <i v-else class="bi bi-lightning-charge me-1"></i> Phát voucher nhanh
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
                  <div class="col-md-12">
                    <label class="form-label mb-1 text-secondary small"
                      >Tìm kiếm User qua Email
                      <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <input
                        type="email"
                        class="form-control rounded-3"
                        v-model="searchEmail"
                        placeholder="Nhập email người dùng"
                        required
                      />
                      <button
                        class="btn btn-outline-primary"
                        type="button"
                        @click="handleSearchEmail"
                        :disabled="searchingEmail"
                      >
                        <span
                          v-if="searchingEmail"
                          class="spinner-border spinner-border-sm"
                        ></span>
                        <span v-else>Tìm kiếm</span>
                      </button>
                    </div>
                    <div v-if="emailError" class="text-danger small mt-1">
                      {{ emailError }}
                    </div>
                    <div v-if="foundUserName" class="text-success small mt-1">
                      {{ foundUserName }}
                    </div>
                  </div>
                  <div class="col-md-6">
                    <!-- <label class="form-label mb-1 text-secondary small"
                      >User ID <span class="text-danger">*</span></label
                    > -->
                    <input
                     type="hidden"
                      class="form-control rounded-3"
                      v-model="addForm.userId"
                      readonly
                      required
                    />
                    <div v-if="userIdError" class="text-danger small mt-1">
                      {{ userIdError }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <!-- <label class="form-label mb-1 text-secondary small"
                      >Voucher ID</label
                    > -->
                    <input
                     type="hidden"
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
                  :disabled="!addForm.userId"
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
          style="margin-right: 10px;"
        >
          Sau
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getUsersByVoucherId,giveVoucherToAll } from "@/services/admin/voucher";
import { addVoucherForNewuser } from "@/services/client/userVoucher";
import { getUserIdByEmail } from "@/services/admin/user";
import { showToast } from "@/utils/swalHelper";
import Swal from 'sweetalert2';

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
    const pageSize = ref(5);
    const currentPage = ref(0);
    const givingAll = ref(false);


    const userIdError = ref("");

    // Modal state
    const showAddForm = ref(false);
    const addForm = ref({
      userId: "",
      voucherId: props.id,
    });

    // Email search state
    const searchEmail = ref("");
    const searchingEmail = ref(false);
    const emailError = ref("");
    const foundUserName = ref("");

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
      };
      searchEmail.value = "";
      emailError.value = "";
      foundUserName.value = "";
      showAddForm.value = true;
    }
    function closeAddForm() {
      showAddForm.value = false;
    }
    async function submitAddForm() {
      userIdError.value = ""; // Reset lỗi

      const exists = users.value.some(
        (user) => user.userId === addForm.value.userId
      );
      if (exists) {
        // userIdError.value = "Người dùng này đã được nhận voucher trước đó.";
        showToast("error", "Người dùng này đã nhận voucher trước đó.");
        return;
      }
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
    async function handleSearchEmail() {
      emailError.value = "";
      foundUserName.value = "";
      addForm.value.userId = "";
      // Validate email
      const email = searchEmail.value.trim();
      if (!email) {
        emailError.value = "Vui lòng nhập email.";
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailError.value = "Email không hợp lệ.";
        return;
      }
      searchingEmail.value = true;
      try {
        const res = await getUserIdByEmail(email);
        if (res.data && res.data.status === 200 && res.data.data) {
          addForm.value.userId = res.data.data;
          foundUserName.value = res.data.message || ""; // Nếu backend trả về tên, gán vào đây
        } else {
          emailError.value =
            res.data?.message || "Không tìm thấy user với email này.";
        }
      } catch (e) {
        emailError.value = "Không tìm thấy user với email này.";
      } finally {
        searchingEmail.value = false;
      }
    }

  async function confirmGiveAll() {
  const result = await Swal.fire({
    title: 'Phát voucher cho TẤT CẢ người dùng?',
    text: 'Bạn có chắc chắn muốn phát voucher này đến tất cả người dùng?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '✅ Phát ngay',
    cancelButtonText: '❌ Hủy',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });

  if (!result.isConfirmed) return;

  givingAll.value = true;
  try {
    const res = await giveVoucherToAll(voucherId);
    showToast("success", "✅ Đã phát voucher cho tất cả người dùng!");

    // Làm mới danh sách người dùng đã nhận voucher
    loading.value = true;
    const updated = await getUsersByVoucherId(voucherId);
    users.value = updated;
  } catch (e) {
    showToast("error", "❌ Lỗi khi phát voucher hàng loạt!");
  } finally {
    givingAll.value = false;
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
      searchEmail,
      searchingEmail,
      emailError,
      handleSearchEmail,
      foundUserName,
      userIdError,
      id: props.id,
      givingAll,
      confirmGiveAll
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
