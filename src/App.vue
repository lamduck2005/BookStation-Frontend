<script setup>
import Cart from './view/detail/Cart.vue';
import DetailProduct from './view/detail/DetailProduct.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <h1>BookStation</h1>
  <Cart />
  <Router-view />
</template>

<style scoped>
body {
    background: #bdacac !important;
}
</style>
