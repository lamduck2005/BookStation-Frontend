<template>
  <div class="pos-layout">
    <div class="pos-main">
      <PosHeader />
      <PosOrderList />
    </div>
    <div class="pos-sidebar">
      <PosCustomerInfo />
      <PosOrderSummary />
      <PosPayment />
    </div>
  </div>
</template>

<script setup>
import PosCustomerInfo from './pos/PosCustomerInfo.vue';
import PosHeader from './pos/PosHeader.vue';
import PosOrderList from './pos/PosOrderList.vue';
import PosOrderSummary from './pos/PosOrderSummary.vue';
import PosPayment from './pos/PosPayment.vue';


</script>

<style scoped>
.pos-layout {
  display: flex;
  height: 100vh;
  background: #f8fafd;
}
.pos-main {
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
}
.pos-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #f4f6fb;
  border-left: 1px solid #e5e7eb;
}
</style>
