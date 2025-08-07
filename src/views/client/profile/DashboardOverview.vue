<template>
  <div class="dashboard-overview">
    <!-- 1. Overview Stats -->
    <OverviewStats />

    <!-- 2. Revenue and Books Sold Charts -->
    <div class="charts-row">
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
import OverviewStats from "@/components/dashboard/OverviewStats.vue";
import RevenueChart from "@/components/dashboard/RevenueChart.vue";
import BooksSoldChart from "@/components/dashboard/BooksSoldChart.vue";
import TopBooksTable from "@/components/dashboard/TopBooksTable.vue";
import TopUsersTable from "@/components/dashboard/TopUsersTable.vue";
import InventoryStatusTable from "@/components/dashboard/InventoryStatusTable.vue";
</script>

<style scoped>
.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.charts-row,
.top-tables-row {
  display: flex;
  gap: 24px;
}
</style>
