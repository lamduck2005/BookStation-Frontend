<template>
    <section class="page_error">
        <div class="container">
            <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                <div class="col-md-8 text-center">
                    <h1 class="error_code">{{ errorCode }}</h1>

                    <div class="error_bg"></div>

                    <div class="content_box_error">
                        <h3 class="h2">Đã có lỗi xảy ra</h3>
                        <p>{{ errorDescription }}</p>
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-dark" @click="goBack"> 
                                <i class="fa-solid fa-arrow-left"></i>
                                Quay lại
                            </button>
                            <router-link to="/" class="btn btn-success">
                                <i class="fa-solid fa-house"></i>
                                Về trang chủ
                            </router-link>
                            <router-link to="/auth" class="btn btn-success">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                Đăng nhập
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    status: {
        type: [Number, String],
        default: 404
    },
    message: {
        type: String,
        default: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã xảy ra lỗi.'
    }
});

const route = useRoute();

// Sử dụng computed để tự động cập nhật khi props hoặc route thay đổi
const errorCode = computed(() => {
    // Ưu tiên:  query params > props > default
    return  Number(route.query.status) || Number(props.status) || 404;
});

const errorDescription = computed(() => {
    // Ưu tiên: query params > props > default
    return route.query.message || props.message || 'Trang bạn đang tìm kiếm không tồn tại hoặc đã xảy ra lỗi.';
});

const goBack = () => {
    window.history.back();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.page_error {
    padding: 40px 0;
    background: #fff;
    font-family: 'Roboto', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.error_code {
    font-size: 60px;
    font-weight: 700;
    margin-bottom: 30px;
    color: #333;
}

.error_bg {
    background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
    height: 400px;
    background-position: center;
    background-size: cover;
    margin-bottom: 30px;
    border-radius: 10px;
}

.content_box_error {
    margin-top: 20px;
}

.content_box_error h3 {
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 15px;
    color: #555;
}

.content_box_error p {
    font-size: 18px;
    color: #777;
}


/* CSS chung cho tất cả button */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;
    overflow: hidden;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}


</style>
