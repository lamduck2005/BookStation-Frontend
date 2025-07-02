<template>
    <div class="main-layout">
        <!-- Header component - chỉ render 1 lần -->
        <Header />

        <!-- Main content area - nội dung sẽ thay đổi theo route -->
        <main class="content-wrapper">
            <router-view />
        </main>

        <!-- Footer component - chỉ render 1 lần -->
        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<style scoped>
.main-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.content-wrapper {
    flex: 1;
    background-color: #f8f9fa;
}
</style>
