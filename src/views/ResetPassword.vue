<script setup>
import router from '@/router'
import { showAlert, showToast } from '@/utils/swalHelper'
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios' // Giả sử có axios config

// Reactive data cho form khôi phục mật khẩu
const resetPasswordForm = ref({
    password: '',
    confirmPassword: ''
})

// Reactive data cho hiện/ẩn mật khẩu
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const stars = [
    { tailLength: '15em', topOffset: '0vh', duration: '9s', delay: '0s' },
    { tailLength: '12em', topOffset: '10vh', duration: '8.5s', delay: '1s' },
    { tailLength: '18em', topOffset: '20vh', duration: '10s', delay: '2s' },
    { tailLength: '14em', topOffset: '30vh', duration: '7.5s', delay: '3s' },
    { tailLength: '16em', topOffset: '40vh', duration: '9.2s', delay: '4s' },
    { tailLength: '13em', topOffset: '50vh', duration: '8.8s', delay: '5s' },
    { tailLength: '17em', topOffset: '60vh', duration: '9.5s', delay: '6s' },
    { tailLength: '14.5em', topOffset: '70vh', duration: '8.2s', delay: '7s' },
    { tailLength: '15.5em', topOffset: '80vh', duration: '9.8s', delay: '8s' },
    { tailLength: '13.5em', topOffset: '90vh', duration: '7.8s', delay: '9s' },
    { tailLength: '16em', topOffset: '15vh', duration: '9.1s', delay: '10s' },
    { tailLength: '13em', topOffset: '25vh', duration: '8.6s', delay: '11s' },
    { tailLength: '17.5em', topOffset: '35vh', duration: '9.3s', delay: '12s' },
    { tailLength: '14.2em', topOffset: '45vh', duration: '8.4s', delay: '13s' },
    { tailLength: '16.8em', topOffset: '55vh', duration: '9.7s', delay: '14s' },
    { tailLength: '13.8em', topOffset: '65vh', duration: '8.9s', delay: '15s' },
    { tailLength: '17.2em', topOffset: '75vh', duration: '9.4s', delay: '16s' },
    { tailLength: '14.8em', topOffset: '85vh', duration: '8.1s', delay: '17s' },
    { tailLength: '16.5em', topOffset: '95vh', duration: '9.6s', delay: '18s' },
    { tailLength: '13.2em', topOffset: '5vh', duration: '8.3s', delay: '19s' },
]

const isGlowBorderShow = ref(true)

const token = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  token.value = params.get('token')
  if (!token.value) {
    showAlert('Lỗi', 'Liên kết không hợp lệ, vui lòng thử lại!')
    router.push('/auth')
  }
})

const validateForm = () => {
  const password = resetPasswordForm.value.password
  const confirmPassword = resetPasswordForm.value.confirmPassword
  
  // Regex cho mật khẩu: a-zA-Z0-9, 6-20 ký tự
  const passwordRegex = /^[a-zA-Z0-9]{6,20}$/
  
  if (!password) {
    errorMessage.value = 'Vui lòng nhập mật khẩu mới!'
    return false
  }
  if (!passwordRegex.test(password)) {
    errorMessage.value = 'Mật khẩu phải từ 6-20 ký tự, chỉ chữ và số!'
    return false
  }
  if (password !== confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp!'
    return false
  }
  
  errorMessage.value = ''
  return true
}

const handleResetPassword = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) {
    showToast('error', errorMessage.value)
    return
  }
  
  isLoading.value = true
  
  try {
    const response = await axios.post('/api/auth/reset-password', {
      token: token.value,
      newPassword: resetPasswordForm.value.password
    })
    
    if (response.data.status === 200) {
      showToast('success', response.data.message || 'Đổi mật khẩu thành công!')
      router.push('/auth')
    } else {
      showToast('error', response.data.message || 'Có lỗi xảy ra!')
    }
  } catch (error) {
    let message = 'Có lỗi xảy ra!'
    if (error.response) {
      message = error.response.data.message || 'Token không hợp lệ hoặc đã hết hạn. Yêu cầu link mới!'
    }
    showToast('error', message)
  } finally {
    isLoading.value = false
  }
}

</script>

<template>
    <div class="reset-password-page">
        <!-- SVG Filters cho hiệu ứng glow -->
        <svg width="0" height="0" aria-hidden="true" class="svg-filters">
            <defs>
                <filter id="glow-0" x="-.25" y="-.25" width="1.5" height="1.5">
                    <feComponentTransfer>
                        <feFuncA type="table" tableValues="0 2 0"></feFuncA>
                    </feComponentTransfer>
                    <feGaussianBlur stdDeviation="1.5"></feGaussianBlur>
                    <feComponentTransfer result="rond">
                        <feFuncA type="table" tableValues="-1.5 2.5"></feFuncA>
                    </feComponentTransfer>
                    <feMorphology operator="dilate" radius="3"></feMorphology>
                    <feGaussianBlur stdDeviation="6"></feGaussianBlur>
                    <feBlend in="rond" result="glow"></feBlend>
                    <feComponentTransfer in="SourceGraphic">
                        <feFuncA type="table" tableValues="0 0 1"></feFuncA>
                    </feComponentTransfer>
                    <feBlend in2="glow"></feBlend>
                </filter>
                
                <filter id="glow-1" x="-.25" y="-.25" width="1.5" height="1.5">
                    <feComponentTransfer in="SourceGraphic" result="grad">
                        <feFuncA type="table" tableValues="0 2 0"></feFuncA>
                    </feComponentTransfer>
                    <feMorphology operator="dilate" radius="3"></feMorphology>
                    <feGaussianBlur stdDeviation="6" result="glow"></feGaussianBlur>
                    <feTurbulence type="fractalNoise" baseFrequency="7.13"></feTurbulence>
                    <feDisplacementMap in="glow" scale="12" yChannelSelector="R"></feDisplacementMap>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope=".8"></feFuncA>
                    </feComponentTransfer>
                    <feBlend in="grad" result="out"></feBlend>
                    <feComponentTransfer in="SourceGraphic">
                        <feFuncA type="table" tableValues="0 0 1"></feFuncA>
                    </feComponentTransfer>
                    <feBlend in2="out"></feBlend>
                </filter>
            </defs>
        </svg>

        <div class="stars">
            <div class="star" v-for="(star, idx) in stars" :key="idx" :style="{
                '--star-tail-length': star.tailLength,
                '--top-offset': star.topOffset,
                '--fall-duration': star.duration,
                '--fall-delay': star.delay
            }"></div>
        </div>

        <!-- Container wrapper cho hiệu ứng glow border -->
        <div class="reset-container-wrapper" :class="{ 'glow-border': isGlowBorderShow }">
            <!-- Form khôi phục mật khẩu -->
            <div class="reset-container">
                <div class="reset-cover">
                    <img src="../assets/img/login/frontImg.jpg" alt="">
                    <div class="text">
                        <span class="text-1">Khôi phục mật khẩu <br> của bạn</span>
                        <span class="text-2">Tạo mật khẩu mới cho tài khoản</span>
                    </div>
                </div>
                <div class="reset-forms">
                    <div class="reset-form-content">
                        <div class="reset-password-form">
                            <div class="title">Khôi phục mật khẩu</div>
                            <form @submit="handleResetPassword">
                                <div class="input-boxes">
                                    <div v-if="errorMessage" class="error-text">{{ errorMessage }}</div>
                                    <div class="input-box">
                                        <i class="bx bx-lock"></i>
                                        <input 
                                            :type="showPassword ? 'text' : 'password'" 
                                            placeholder="Nhập mật khẩu mới" 
                                            v-model="resetPasswordForm.password"
                                            required
                                        >
                                        <i 
                                            :class="showPassword ? 'bx bx-eye' : 'bx bx-eye-closed'" 
                                            class="password-toggle"
                                            @click="showPassword = !showPassword"
                                        ></i>
                                    </div>
                                    <div class="input-box">
                                        <i class="bx bx-lock"></i>
                                        <input 
                                            :type="showConfirmPassword ? 'text' : 'password'" 
                                            placeholder="Nhập lại mật khẩu mới" 
                                            v-model="resetPasswordForm.confirmPassword"
                                            required
                                        >
                                        <i 
                                            :class="showConfirmPassword ? 'bx bx-eye' : 'bx bx-eye-closed'" 
                                            class="password-toggle"
                                            @click="showConfirmPassword = !showConfirmPassword"
                                        ></i>
                                    </div>
                                    <div class="button input-box">
                                        <input type="submit" :value="isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'" :disabled="isLoading">
                                    </div>
                                    <div class="text back-to-login">
                                        <a href="#" @click.prevent="router.push('/auth')">← Quay lại đăng nhập</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Google Font Link */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap');

/* CSS Custom Property cho animation */
@property --a {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.reset-password-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
    padding: 30px;
    overflow: hidden;
    position: relative;
    /* CSS Variables cho glow effect */
    --b: 6px;
    --m: 2;
}

/* SVG Filters */
.svg-filters {
    position: fixed;
    z-index: -1;
}

/* Hiệu ứng mưa sao băng */
.stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    transform: rotate(-45deg);
    z-index: 0;
}

.star {
    --star-color: #fff;
    --star-tail-height: 1px;
    --star-width: calc(var(--star-tail-length) / 8);
    position: absolute;
    top: var(--top-offset);
    left: 0;
    width: var(--star-tail-length);
    height: var(--star-tail-height);
    color: var(--star-color);
    background: linear-gradient(45deg, currentColor, transparent);
    border-radius: 50%;
    filter: drop-shadow(0 0 3px currentColor);
    transform: translate3d(104em, 0, 0);
    animation: fall var(--fall-duration) var(--fall-delay) linear infinite, tail-fade var(--fall-duration) var(--fall-delay) ease-out infinite, fade-in 2s var(--fall-delay) ease-in forwards;
    opacity: 0;
}

.star::before,
.star::after {
    position: absolute;
    content: '';
    top: 0;
    left: calc(var(--star-width) / -2);
    width: var(--star-width);
    height: 100%;
    background: linear-gradient(45deg, transparent, currentColor, transparent);
    border-radius: inherit;
    animation: blink 2s linear infinite;
}

.star::before {
    transform: rotate(45deg);
}

.star::after {
    transform: rotate(-45deg);
}

@keyframes fall {
    to {
        transform: translate3d(-30em, 0, 0);
    }
}

@keyframes tail-fade {
    0% {
        width: 0;
        opacity: 0;
    }

    10% {
        width: var(--star-tail-length);
        opacity: 1;
    }

    50% {
        width: var(--star-tail-length);
        opacity: 1;
    }

    70%,
    80% {
        width: 0;
        opacity: 0.4;
    }

    100% {
        width: 0;
        opacity: 0;
    }
}

@keyframes blink {
    50% {
        opacity: 0.6;
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

/* Hiệu ứng glow border animation */
@keyframes glow-rotate {
    to { 
        --a: 1turn;
    }
}

/* Container wrapper cho hiệu ứng glow border */
.reset-container-wrapper {
    position: relative;
    max-width: 850px;
    width: 100%;
    height: 500px;
    z-index: 1;
}

/* Glow border effect */
.glow-border {
    box-sizing: border-box;
    border: solid var(--b) transparent;
    border-radius: calc(2*var(--b));
    background: 
        repeating-conic-gradient(from var(--a, 0deg), 
            #0000 0% 35%, 
            #24004619, 
            #3c096c32, 
            #5a189a4b, 
            #7b2cbf64, 
            #9d4edd7f) border-box;
    filter: url(#glow-0);
    animation: glow-rotate 50s linear infinite;
    transition: all 0.3s linear;
}

.reset-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 40px 30px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
}

/* Cover image styles */
.reset-cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    z-index: 10;
}

.reset-cover img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 10;
    border-radius: 0;
}

.reset-cover .text {
    position: absolute;
    z-index: 20;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.reset-cover .text::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0.35;
    background: linear-gradient(135deg, #7d2ae8 0%, #ff6a00 100%);
    z-index: 15;
}

.reset-cover .text .text-1,
.reset-cover .text .text-2 {
    z-index: 30;
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    text-align: center;
}

.reset-cover .text .text-2 {
    font-size: 15px;
    font-weight: 500;
}

/* Form styles */
.reset-forms {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.reset-form-content {
    width: 80%;
    max-width: 350px;
}

.reset-password-form .title {
    position: relative;
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 30px;
}

.reset-password-form .title:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    height: 3px;
    width: 35px;
    background: #dc3545;
}

.reset-password-form .input-boxes {
    margin-top: 20px;
}

.reset-password-form .input-box {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    margin: 15px 0;
    position: relative;
}

.reset-password-form .input-box input {
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    padding: 0 30px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.reset-password-form .input-box input:focus,
.reset-password-form .input-box input:valid {
    border-color: #dc3545;
}

.reset-password-form .input-box i {
    position: absolute;
    color: #dc3545;
    font-size: 17px;
}

.reset-password-form .input-box .password-toggle {
    right: 10px;
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 10;
}

.reset-password-form .input-box .password-toggle:hover {
    color: #a02834;
}

.reset-password-form .button {
    color: #fff;
    margin-top: 25px;
}

.reset-password-form .button input {
    color: #fff;
    background: #dc3545;
    border-radius: 6px;
    padding: 0;
    cursor: pointer;
    transition: all 0.4s ease;
    height: 100%;
    width: 100%;
    border: none;
    font-size: 16px;
    font-weight: 500;
}

.reset-password-form .button input:hover {
    background: #c82333;
}

.reset-password-form .back-to-login {
    text-align: center;
    margin-top: 20px;
}

.reset-password-form .back-to-login a {
    color: #dc3545;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
}

.reset-password-form .back-to-login a:hover {
    text-decoration: underline;
}

.reset-password-form .text {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

@media (max-width: 730px) {
    .reset-cover {
        display: none;
    }

    .reset-forms {
        position: relative;
        width: 100%;
        padding: 20px;
    }

    .reset-form-content {
        max-width: 100%;
    }

    /* Điều chỉnh glow border cho mobile */
    .glow-border {
        --b: 4px;
    }
}
</style>