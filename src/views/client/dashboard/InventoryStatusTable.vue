<template>
  <div class="inventory-container">
    <div class="inventory-header">
      <div class="header-title">
        <i class="bi bi-box-seam"></i>
        <h3>Tình trạng tồn kho</h3>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="inventory-table">
        <thead>
          <tr>
            <th class="book-header">Sách</th>
            <th class="stock-header">Tồn kho</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.name" class="book-row">
            <td class="book-name">{{ book.name }}</td>
            <td class="stock-number">{{ book.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllBookStock } from "@/services/admin/dashboard";

const books = ref([]);

onMounted(async () => {
  const res = await getAllBookStock();
  books.value = res.map((item) => ({
    name: item.bookName,
    stock: item.stockQuantity,
  }));
});
</script>

<style scoped>
.inventory-container {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.inventory-container:hover {
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

.inventory-header {
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff;
  border-bottom: none;
  border-radius: 15px 15px 0 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title i {
  font-size: 20px;
  color: #ffffff;
  transform: none; /* Đảm bảo không bị nghiêng */
}

.inventory-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.inventory-table thead {
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
}

.inventory-table th {
  padding: 16px 24px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #667eea;
  background: #ffffff;
}

.book-header {
  width: 70%;
}

.stock-header {
  width: 30%;
  text-align: right !important;
}

.book-row {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.book-row:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  border-left-color: #667eea;
  transform: translateX(2px);
}

.inventory-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.book-row:last-child td {
  border-bottom: none;
}

.book-name {
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.book-row:hover .book-name {
  color: #e67e22;
  font-weight: 800;
}

.stock-number {
  font-size: 14px;
  font-weight: 800;
  color: #27ae60;
  text-align: right;
  font-variant-numeric: tabular-nums;
  transition: all 0.3s ease;
}

.book-row:hover .stock-number {
  color: #229954;
  transform: scale(1.05);
}

/* Stock status colors based on quantity */
.book-row:nth-child(even) {
  background-color: rgba(102, 126, 234, 0.02);
}

.book-row:nth-child(even):hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
}

/* Responsive design */
@media (max-width: 768px) {
  .inventory-header {
    padding: 16px 20px 12px;
  }

  .inventory-header h3 {
    font-size: 15px;
  }

  .header-title i {
    font-size: 18px;
  }

  .inventory-table th,
  .inventory-table td {
    padding: 12px 20px;
  }

  .inventory-table th {
    font-size: 12px;
  }

  .book-name,
  .stock-number {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .inventory-header {
    padding: 12px 16px 8px;
  }

  .inventory-table th,
  .inventory-table td {
    padding: 10px 16px;
  }

  .book-name,
  .stock-number {
    font-size: 12px;
  }
}

/* Custom scrollbar với màu tím */
.table-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
