<template>
  <div class="dashboard-overview">
    <!-- 1. Overview Stats -->
    <OverviewStats />

    <!-- Location Stats -->
    <LocationStats />

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
import LocationStats from "@/views/admin/components-admin/statistics/LocationStats.vue";
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
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  border: 1px solid #e2e8f0;
  padding: 20px;
  min-width: 0;
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
}
</style>
