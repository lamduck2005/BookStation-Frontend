<template>
  <div class="top-books-container">
    <div class="header-section">
      <div class="icon-title">
        <i class="bi bi-trophy-fill trophy-icon"></i>
        <h3>Top nhà xuất bản theo doanh thu</h3>
      </div>
    </div>

    <div class="table-container">
      <table class="top-books-table">
        <tbody>
          <tr v-for="(book, index) in books" :key="book.name" class="book-row">
            <td class="rank-cell">
              <div class="rank-badge" :class="getRankClass(index)">
                {{ index + 1 }}
              </div>
            </td>
            <td class="book-info">
              <div class="book-name">{{ book.name }}</div>
              <div class="book-detail">Đã bán: {{ book.sold }} cuốn</div>
            </td>
            <td class="revenue-cell">
              <div class="revenue-amount">{{ book.revenue }}</div>
              <div class="revenue-label">doanh thu</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getTopBookSold } from "@/services/admin/dashboard";

const books = ref([]);

onMounted(async () => {
  const res = await getTopBookSold(5);
  books.value = res.map((item) => ({
    name: item.bookName,
    sold: item.soldQuantity,
    revenue: (item.soldQuantity * 98000).toLocaleString() + " đ",
  }));
});

const getRankClass = (index) => {
  if (index === 0) return "rank-1";
  if (index === 1) return "rank-2";
  if (index === 2) return "rank-3";
  return "rank-other";
};
</script>

<style scoped>
.top-books-container {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.top-books-container:hover {
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

.header-section {
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff;
  border-bottom: none;
  border-radius: 15px 15px 0 0;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trophy-icon {
  font-size: 20px;
  color: #ffffff;
  display: inline-block;
  transform: none; /* Đảm bảo không bị nghiêng */
}

.icon-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.table-container {
  max-height: 320px;
  overflow-y: auto;
}

.top-books-table {
  width: 100%;
  border-collapse: collapse;
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

.book-row td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.book-row:last-child td {
  border-bottom: none;
}

.rank-cell {
  width: 50px;
  padding-right: 16px !important;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.book-row:hover .rank-badge {
  transform: scale(1.1);
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.rank-badge.rank-other {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.book-info {
  flex: 1;
  min-width: 0;
}

.book-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.book-row:hover .book-name {
  color: #667eea;
}

.book-detail {
  font-size: 12px;
  color: #667eea;
  line-height: 1.2;
  font-weight: 600;
}

.revenue-cell {
  text-align: right;
  white-space: nowrap;
}

.revenue-amount {
  font-size: 15px;
  font-weight: 800;
  color: #667eea;
  line-height: 1.2;
  margin-bottom: 2px;
  transition: all 0.3s ease;
}

.book-row:hover .revenue-amount {
  color: #5a6fd8;
  transform: scale(1.05);
}

.revenue-label {
  font-size: 11px;
  color: #64748b;
  line-height: 1;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .header-section {
    padding: 16px 20px 12px;
  }

  .icon-title h3 {
    font-size: 15px;
  }

  .trophy-icon {
    font-size: 18px;
  }

  .book-row td {
    padding: 12px 20px;
  }

  .book-name {
    font-size: 13px;
  }

  .book-detail {
    font-size: 11px;
  }

  .revenue-amount {
    font-size: 14px;
  }
}
</style>
