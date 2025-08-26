<template>
  <div class="dashboard-overview">
    <!-- 1. Overview Stats -->
    <OverviewStats />

    
    
    <!-- Toggle Revenue Chart -->
    <div class="mb-4">
      <button
      class="btn mb-2 rounded-pill px-4 fw-bold"
      style="background: linear-gradient(90deg, #4f8cff 0%, #6ed0fa 100%); color: #fff; border: none; box-shadow: 0 2px 8px #e3e8ee;"
      @click="showRevenueChart = !showRevenueChart"
      >
      <i :class="showRevenueChart ? 'bi bi-bar-chart-line-fill' : 'bi bi-bar-chart-line'" style="font-size: 1.2em;"></i>
      <span class="ms-2">{{ showRevenueChart ? 'Ẩn thống kê đơn hàng' : 'Hiện thống kê đơn hàng' }}</span>
    </button>
    <div v-show="showRevenueChart">
      <OrderPerformanceChart />
    </div>
  </div>


  <!-- Toggle Performance Chart -->
  <div class="mb-4">
    <button
      class="btn mb-2 rounded-pill px-4 fw-bold"
      style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; box-shadow: 0 2px 8px #e3e8ee;"
      @click="showPerformanceChart = !showPerformanceChart"
    >
      <i :class="showPerformanceChart ? 'bi bi-graph-up-arrow-fill' : 'bi bi-graph-up-arrow'" style="font-size: 1.2em;"></i>
      <span class="ms-2">{{ showPerformanceChart ? 'Ẩn biểu đồ hiệu suất sách' : 'Hiện biểu đồ hiệu suất sách' }}</span>
    </button>
    <div v-show="showPerformanceChart">
      <BookPerformanceChart ref="performanceChartRef" />
    </div>
  </div>

  <!-- Location Stats -->
  <LocationStats />
    <!-- 3. Top Books & Top Users Tables -->
    <div class="top-tables-row">
      <TopBooksTable />
      <TopUsersTable />
    </div>

    <!-- 4. Inventory Status Table -->
    <InventoryStatusTable />

    <!-- 5. Supplier Statistics Cards -->
    <div class="statistics-section supplier-section">
      <div class="section-header supplier-header">
        <div class="header-content">
          <div class="icon-wrapper supplier-icon">
            <i class="bi bi-truck"></i>
          </div>
          <div class="header-text">
            <h3 class="section-title">Thống kê nhà cung cấp</h3>
            <p class="section-subtitle">Phân tích chi tiết về các nhà cung cấp và sản phẩm</p>
          </div>
        </div>
        <div class="header-badge supplier-badge">
          <i class="bi bi-graph-up"></i>
        </div>
      </div>
      <div class="section-content">
        <SupplierStatisticsCards /> 
      </div>
    </div>

    <!-- 6. Publisher Statistics Cards -->
    <div class="statistics-section publisher-section">
      <div class="section-header publisher-header">
        <div class="header-content">
          <div class="icon-wrapper publisher-icon">
            <i class="bi bi-building"></i>
          </div>
          <div class="header-text">
            <h3 class="section-title">Thống kê nhà xuất bản</h3>
            <p class="section-subtitle">Dữ liệu về các nhà xuất bản và đầu sách</p>
          </div>
        </div>
        <div class="header-badge publisher-badge">
          <i class="bi bi-book"></i>
        </div>
      </div>
      <div class="section-content">
        <PublisherStatisticsCards /> 
      </div>
    </div>

    <!-- 7. Rank Statistics Cards -->
    <div class="statistics-section rank-section">
      <div class="section-header rank-header">
        <div class="header-content">
          <div class="icon-wrapper rank-icon">
            <i class="bi bi-award"></i>
          </div>
          <div class="header-text">
            <h3 class="section-title">Thống kê xếp hạng</h3>
            <p class="section-subtitle">Phân tích hạng thành viên và điểm thưởng</p>
          </div>
        </div>
        <div class="header-badge rank-badge">
          <i class="bi bi-trophy"></i>
        </div>
      </div>
      <div class="section-content">
        <RankStatisticsCards /> 
      </div>
    </div>

    <!-- 8. Point Statistics Cards -->
    <div class="statistics-section point-section">
      <div class="section-header point-header">
        <div class="header-content">
          <div class="icon-wrapper point-icon">
            <i class="bi bi-coin"></i>
          </div>
          <div class="header-text">
            <h3 class="section-title">Thống kê điểm thưởng</h3>
            <p class="section-subtitle">Theo dõi tích lũy và sử dụng điểm của khách hàng</p>
          </div>
        </div>
        <div class="header-badge point-badge">
          <i class="bi bi-wallet2"></i>
        </div>
      </div>
      <div class="section-content">
        <PointStatisticsCards /> 
      </div>
    </div>
  </div>
</template>

<script setup>
import OverviewStats from "@/views/client/dashboard/OverviewStats.vue";
import RevenueChart from "@/views/client/dashboard/RevenueChart.vue";
import BooksSoldChart from "@/views/client/dashboard/BooksSoldChart.vue";
import TopBooksTable from "@/views/client/dashboard/TopBooksTable.vue";
import TopUsersTable from "@/views/client/dashboard/TopUsersTable.vue";
import InventoryStatusTable from "@/views/client/dashboard/InventoryStatusTable.vue";
import LocationStats from "@/views/admin/components-admin/statistics/LocationStats.vue";
import SupplierStatisticsCards from "../components-admin/statistics/SupplierStatisticsCards.vue";
import PublisherStatisticsCards from "../components-admin/statistics/PublisherStatisticsCards.vue";
import RankStatisticsCards from "../components-admin/statistics/RankStatisticsCards.vue";
import PointStatisticsCards from "../components-admin/statistics/PointStatisticsCards.vue";
import OrderPerformanceChart from "../components-admin/statistics/OrderPerformanceChart.vue";
import { ref } from "vue";
import BookPerformanceChart from "../components-admin/statistics/BookPerformanceChart.vue";

// Toggle for RevenueChart
const showRevenueChart = ref(false);

// Toggle for PerformanceChart
const showPerformanceChart = ref(false);
const performanceChartRef = ref(null);


</script>

<style scoped>
.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 24px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Charts column styling */
.charts-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.charts-col > * {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: 1px solid #e2e8f0;
  padding: 20px;
  min-width: 0;
}

/* Top tables row styling */
.top-tables-row {
  display: flex;
  gap: 24px;
}

.top-tables-row > * {
  flex: 1;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: 1px solid #e2e8f0;
  /* padding: 20px; */
  min-width: 0;
}

/* Statistics Sections Styling */
.statistics-section {
  margin-bottom: 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s ease;
}

.statistics-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.section-header {
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
}

.header-text {
  flex: 1;
}

.section-title {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.section-subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
  font-weight: 500;
}

.header-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-content {
  padding: 24px;
}

/* Supplier Section - Blue Theme */
.supplier-section .supplier-header {
  background: #f8faff;
}

.supplier-icon {
  background: #3b82f6;
}

.supplier-badge {
  background: #1e40af;
}

.supplier-section .section-title {
  color: #1e40af;
}

/* Publisher Section - Green Theme */
.publisher-section .publisher-header {
  background: #f0fdf4;
}

.publisher-icon {
  background: #22c55e;
}

.publisher-badge {
  background: #16a34a;
}

.publisher-section .section-title {
  color: #16a34a;
}

/* Rank Section - Purple Theme */
.rank-section .rank-header {
  background: #faf5ff;
}

.rank-icon {
  background: #a855f7;
}

.rank-badge {
  background: #9333ea;
}

.rank-section .section-title {
  color: #9333ea;
}

/* Point Section - Orange Theme */
.point-section .point-header {
  background: #fff7ed;
}

.point-icon {
  background: #f97316;
}

.point-badge {
  background: #ea580c;
}

.point-section .section-title {
  color: #ea580c;
}

@media (max-width: 900px) {
  .dashboard-overview {
    padding: 12px 16px;
    gap: 16px;
  }

  .charts-col,
  .top-tables-row {
    flex-direction: column;
    gap: 16px;
  }

  .charts-col > *,
  .top-tables-row > * {
    padding: 16px;
  }

  .statistics-section {
    margin-bottom: 24px;
  }

  .section-header {
    padding: 20px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-content {
    width: 100%;
  }

  .header-badge {
    align-self: flex-end;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .section-subtitle {
    font-size: 13px;
  }

  .section-content {
    padding: 20px;
  }
}
</style>
