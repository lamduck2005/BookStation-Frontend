<template>
  <div class="dashboard-overview">
    <!-- 1. Overview Stats -->
    <OverviewStats />

    <!-- 2. Revenue Chart (top) & Books Sold Chart (bottom) -->
    <div class="charts-col">
      <RevenueChart />
      <BooksSoldChart />
    </div>

    <!-- 3. Top Books & Top Users Tables -->
    <div class="top-tables-row">
      <TopBooksTable />
      <TopUsersTable />
    </div>

    <!-- 4. Inventory Status Table -->
    <InventoryStatusTable />
  </div>
</template>

<script setup>
import OverviewStats from "@/views/client/dashboard/OverviewStats.vue";
import RevenueChart from "@/views/client/dashboard/RevenueChart.vue";
import BooksSoldChart from "@/views/client/dashboard/BooksSoldChart.vue";
import TopBooksTable from "@/views/client/dashboard/TopBooksTable.vue";
import TopUsersTable from "@/views/client/dashboard/TopUsersTable.vue";
import InventoryStatusTable from "@/views/client/dashboard/InventoryStatusTable.vue";
</script>

<style scoped>
.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 32px;
  background: #f7fafd;
  min-height: 100vh;
}

/* Sửa lại charts thành dạng cột */
.charts-col {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.charts-col > * {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #e3e8ee;
  padding: 24px;
  min-width: 0;
}

.top-tables-row {
  display: flex;
  gap: 32px;
}

.top-tables-row > * {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #e3e8ee;
  padding: 24px;
  min-width: 0;
}

@media (max-width: 900px) {
  .charts-col,
  .top-tables-row {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
