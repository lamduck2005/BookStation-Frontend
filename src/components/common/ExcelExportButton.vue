<template>
  <download-excel
    :fetch="fetchDataForExcel"
    :fields="excelFields"
    :name="fileName"
    :type="fileType"
    :worksheet="worksheetName"
    :before-generate="startExcelDownload"
    :before-finish="finishExcelDownload"
    :class="buttonClass">
    <i :class="iconClass"></i> {{ buttonText }}
  </download-excel>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { showQuickConfirm, showToast } from '@/utils/swalHelper.js';
import { 
  exportRanks, exportBooks, exportUsers, exportOrders, exportReviews, 
  exportCategories, exportAuthors, exportPublishers, exportVouchers, 
  exportSuppliers, exportPoints, exportFlashSales,
  getRankFields, getBookFields, getUserFields, getOrderFields, getReviewFields,
  getCategoryFields, getAuthorFields, getPublisherFields, getVoucherFields,
  getSupplierFields, getPointFields, getFlashSaleFields
} from '@/services/admin/excel.js';

// Props
const props = defineProps({
  dataType: {
    type: String,
    required: true,
    validator: (value) => [
      'ranks', 'books', 'users', 'orders', 'reviews', 
      'categories', 'authors', 'publishers', 'vouchers', 
      'suppliers', 'points', 'flashSales'
    ].includes(value)
  },
  buttonText: {
    type: String,
    default: 'Xuất Excel'
  },
  buttonClass: {
    type: String,
    default: 'btn btn-success btn-sm py-2'
  },
  iconClass: {
    type: String,
    default: 'bi bi-file-earmark-excel me-1'
  },
  fileType: {
    type: String,
    default: 'xlsx'
  }
});

// Reactive data
const excelFields = ref({});

// Computed properties
const fileName = computed(() => {
  const typeNames = {
    ranks: 'danh-sach-hang-thanh-vien',
    books: 'danh-sach-sach',
    users: 'danh-sach-nguoi-dung',
    orders: 'danh-sach-don-hang',
    reviews: 'danh-sach-danh-gia',
    categories: 'danh-sach-the-loai',
    authors: 'danh-sach-tac-gia',
    publishers: 'danh-sach-nha-xuat-ban',
    vouchers: 'danh-sach-phieu-giam-gia',
    suppliers: 'danh-sach-nha-cung-cap',
    points: 'danh-sach-diem',
    flashSales: 'danh-sach-giam-gia-nhanh'
  };
  
  const date = new Date().toISOString().split('T')[0];
  return `${typeNames[props.dataType]}-${date}.${props.fileType}`;
});

const worksheetName = computed(() => {
  const typeNames = {
    ranks: 'Hạng Thành Viên',
    books: 'Danh Sách Sách',
    users: 'Danh Sách Người Dùng',
    orders: 'Danh Sách Đơn Hàng',
    reviews: 'Đánh Giá Sản Phẩm',
    categories: 'Danh Sách Thể Loại',
    authors: 'Danh Sách Tác Giả',
    publishers: 'Danh Sách Nhà Xuất Bản',
    vouchers: 'Danh Sách Phiếu Giảm Giá',
    suppliers: 'Danh Sách Nhà Cung Cấp',
    points: 'Danh Sách Điểm',
    flashSales: 'Danh Sách Giảm Giá Nhanh'
  };
  
  return typeNames[props.dataType];
});

// Methods
const fetchDataForExcel = async () => {
  const result = await showQuickConfirm("Xác nhận tải xuống file Excel", "Bạn có chắc chắn muốn tải xuống file Excel với bảng này?", "info", "Tải xuống", "Hủy");
  if (!result.isConfirmed) throw new Error("Từ chối tải xuống file Excel");

  try {
    const exportFunctions = {
      ranks: exportRanks,
      books: exportBooks,
      users: exportUsers,
      orders: exportOrders,
      reviews: exportReviews,
      categories: exportCategories,
      authors: exportAuthors,
      publishers: exportPublishers,
      vouchers: exportVouchers,
      suppliers: exportSuppliers,
      points: exportPoints,
      flashSales: exportFlashSales
    };
    
    const exportFunction = exportFunctions[props.dataType];
    if (!exportFunction) {
      throw new Error(`Không hỗ trợ export cho loại: ${props.dataType}`);
    }
    
    const response = await exportFunction();
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi fetch data cho Excel (${props.dataType}):`, error);
    showToast('error', `Lỗi khi tải dữ liệu xuất Excel: ${props.dataType}`);
    return [];
  }
};

const startExcelDownload = () => {
  showToast('info', 'Đang chuẩn bị file Excel...');
};

const finishExcelDownload = () => {
  showToast('success', 'Xuất Excel thành công!');
};

const loadExcelFields = async () => {
  try {
    const fieldFunctions = {
      ranks: getRankFields,
      books: getBookFields,
      users: getUserFields,
      orders: getOrderFields,
      reviews: getReviewFields,
      categories: getCategoryFields,
      authors: getAuthorFields,
      publishers: getPublisherFields,
      vouchers: getVoucherFields,
      suppliers: getSupplierFields,
      points: getPointFields,
      flashSales: getFlashSaleFields
    };
    
    const fieldFunction = fieldFunctions[props.dataType];
    if (!fieldFunction) {
      throw new Error(`Không hỗ trợ fields cho loại: ${props.dataType}`);
    }
    
    const response = await fieldFunction();
    excelFields.value = response.data.fields;
  } catch (error) {
    console.error(`Lỗi khi load Excel fields (${props.dataType}):`, error);
  }
};

// Lifecycle
onMounted(() => {
  loadExcelFields();
});
</script>
