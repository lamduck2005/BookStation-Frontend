<template>
    <div class="breadcrumb w-100 bg-light p-1 ps-4">
        <div class="text-center align-content-center">
            <span class="me-3">
                <i class='bxr bx-home-alt-2'  ></i>
                <i class='bx  bx-chevron-right'  ></i> 
              </span>
            <span v-for="(crumb, idx) in route.matched.filter(r => r.name)" :key="crumb.path">
                <span v-if="idx < route.matched.filter(r => r.name).length - 1" class="text-secondary opacity-100">
                    {{ crumb.name }} /
                </span>
                <span v-else class="fw-bold text-dark">{{ crumb.name }}</span>
            </span>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.breadcrumb {
   box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
}
</style>