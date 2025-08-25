<script setup>
import router from '@/router'
import { showAlert, showToast } from '@/utils/swalHelper'
import { ref } from 'vue'
import { register, login, forgotPassword } from '@/services/auth'
import { validate } from '@/utils/validation.js'
import QuickAdminLogin from './admin/components-admin/QuickAdminLogin.vue'

// Reactive data cho form đăng nhập
const loginForm = ref({
    email: '',
    password: ''
})

// Reactive data cho form đăng ký
const registerForm = ref({
    fullName: '',
    email: '',
    password: ''
})

// Reactive data cho form quên mật khẩu
const forgotPasswordForm = ref({
    email: ''
})

// Reactive data cho hiện/ẩn mật khẩu
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

// Hàm login nhanh admin
const quickAdminLogin = async () => {
    console.log('Quick admin login button clicked');
    loginForm.value.email = 'admin@bookstation.com';
    loginForm.value.password = 'admin123';
    // Gọi luôn hàm login, không cần submit form
    await handleLogin({ preventDefault: () => {} });
}

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

const isContainerFlipped = ref(false)
const isGlowBorderShow = ref(true)

// Hàm toggle form quên mật khẩu
const showForgotPassword = () => {
    isContainerFlipped.value = !isContainerFlipped.value
    // Tắt glow border khi flip
    isGlowBorderShow.value = false
    // Bật lại glow border sau 1 giây
    setTimeout(() => {
        isGlowBorderShow.value = true
    }, 1000)
}

// Hàm chuyển hướng sang trang đăng nhập (dùng cho các nút ngoài AuthPage)
 const goToLogin = () => {
    router.push('/auth')
}

// Hàm xử lý đăng nhập
const handleLogin = async (e) => {
    e.preventDefault();

    try {
        // Gọi API đăng nhập
        const res = await login({
            email: loginForm.value.email,
            password: loginForm.value.password,
        });

        // Lưu token & thông tin người dùng
        const { token, user } = res.data.data;
        if (token) {
            localStorage.setItem('authToken', token);
            // Lưu thêm cookie để thuận tiện cho backend nếu cần
            document.cookie = `authToken=${token}; path=/;`;
        }
        // if (user) {
        //     localStorage.setItem('authUser', JSON.stringify(user));
        // }

        showToast('success', res.data.message || 'Đăng nhập thành công!');

        if (user?.roleName == "CUSTOMER") {
            router.push('/');
        } else {
            router.push('/admin/dashboard');
        }
    } catch (error) {
        showToast('error', error?.response?.data?.message || 'Sai email hoặc mật khẩu!');
    }
};

const validateRegisterForm = () => {
  const validations = [
    validate.fullName(registerForm.value.fullName.trim()),
    validate.email(registerForm.value.email.trim()),
    validate.password(registerForm.value.password)
  ];

  // Check if any validation failed
  for (const validation of validations) {
    if (validation !== null) {
      showToast('error', validation);
      return false;
    }
  }
  
  return true;
}

// Hàm xử lý đăng ký
const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validateRegisterForm()) {
        return;
    }
    
    try{
        const res = await register(registerForm.value);
        console.log('Register data:', res)
    
        showToast('success', res.data.message || 'Đăng ký thành công!')
    
    // Reset form
    registerForm.value = {
        fullName: '',
        email: '',
        password: ''
    }
    } catch (error) {
        showToast('error', error.response.data?.message || 'Đăng ký thất bại!')
    }
}

// Hàm xử lý quên mật khẩu
const handleForgotPassword = async (e) => {
    
    e.preventDefault()

    const email = forgotPasswordForm.value.email.trim()

    // Validation
    const emailError = validate.email(email);
    if (emailError !== null) {
        showToast('error', emailError);
        return;
    }

    try {
        const res = await forgotPassword(email)

        // Hiển thị thông báo với message trả về hoặc mặc định
        showAlert('Thông báo', res?.data?.message || 'Link khôi phục đã được gửi đến email của bạn!')

        // Reset form và có thể flip về đăng nhập
        forgotPasswordForm.value.email = ''
        // isContainerFlipped.value = false
    } catch (error) {
        showToast('error', error?.response?.data?.message || 'Gửi link khôi phục thất bại!')
    }
}

</script>

<template>
    <div class="login-page">
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

        <!-- Container wrapper cho hiệu ứng 3D flip với glow border -->
        <div class="container-wrapper" :class="{ 'flipped': isContainerFlipped, 'glow-border': isGlowBorderShow }">
            <!-- Mặt trước: Form đăng nhập/đăng ký -->
            <div class="container container-front">
                <input type="checkbox" id="flip">
                <div class="cover">
                    <div class="front">
                        <img src="../assets/img/login/frontImg.jpg" alt="">
                        <div class="text">
                            <span class="text-1">Chào mừng bạn đến với <br> BookStation</span>
                            <span class="text-2">Đăng nhập hoặc đăng ký</span>
                        </div>
                    </div>
                    <div class="back">
                        <img class="backImg" src="../assets/img/login/backImg.jpg" alt="">
                        <div class="text">
                            <span class="text-1">Khám phá kiến thức <br> với BookStation</span>
                            <span class="text-2">Đăng ký ngay để trải nghiệm</span>
                        </div>
                    </div>
                </div>
                <div class="forms">
                    <div class="form-content">
                        <div class="login-form">
                            <div class="title">Đăng nhập</div>
                            <!-- Nút vào nhanh admin -->
                            <!-- <QuickAdminLogin @quick-login="quickAdminLogin" /> -->
                            <form @submit="handleLogin">
                                <div class="input-boxes">
                                    <div class="input-box">
                                        <i class="bx bx-envelope"></i>
                                        <input 
                                            type="email" 
                                            placeholder="Nhập email của bạn" 
                                            v-model="loginForm.email"
                                            required
                                        >
                                    </div>
                                    <div class="input-box">
                                        <i class="bx bx-lock"></i>
                                        <input 
                                            :type="showLoginPassword ? 'text' : 'password'" 
                                            placeholder="Nhập mật khẩu" 
                                            v-model="loginForm.password"
                                            required
                                        >
                                        <i 
                                            :class="showLoginPassword ? 'bx bx-eye' : 'bx bx-eye-closed'" 
                                            class="password-toggle"
                                            @click="showLoginPassword = !showLoginPassword"
                                        ></i>
                                    </div>
                                    <div class="text">
                                        <a  href="#" @click.prevent="showForgotPassword">Quên mật khẩu?</a>
                                    </div>
                                    <div class="button input-box">
                                        <input type="submit" value="Đăng nhập">
                                    </div>
                                    <div class="text sign-up-text">Chưa có tài khoản? <label for="flip">Đăng ký
                                            ngay</label></div>
                                </div>
                            </form>
                        </div>
                        <div class="register-form">
                            <div class="title">Đăng ký</div>
                            <form @submit="handleRegister">
                                <div class="input-boxes">
                                    <div class="input-box">
                                        <i class="bx bx-user"></i>
                                        <input 
                                            type="text" 
                                            placeholder="Nhập họ tên" 
                                            v-model="registerForm.fullName"
                                            required
                                        >
                                    </div>
                                    <div class="input-box">
                                        <i class="bx bx-envelope"></i>
                                        <input 
                                            type="email" 
                                            placeholder="Nhập email của bạn" 
                                            v-model="registerForm.email"
                                            required
                                        >
                                    </div>
                                    <div class="input-box">
                                        <i class="bx bx-lock"></i>
                                        <input 
                                            :type="showRegisterPassword ? 'text' : 'password'" 
                                            placeholder="Nhập mật khẩu" 
                                            v-model="registerForm.password"
                                            required
                                        >
                                        <i 
                                            :class="showRegisterPassword ? 'bx bx-eye' : 'bx bx-eye-closed'" 
                                            class="password-toggle"
                                            @click="showRegisterPassword = !showRegisterPassword"
                                        ></i>
                                    </div>
                                    <div class="button input-box">
                                        <input type="submit" value="Đăng ký">
                                    </div>
                                    <div class="text sign-up-text">Đã có tài khoản? <label for="flip">Đăng nhập
                                            ngay</label></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mặt sau: Form quên mật khẩu -->
            <div class="container container-back">
                <div class="forgot-password-cover">
                    <img src="../assets/img/login/flipImg.png" alt="">
                    <div class="text">
                        <span class="text-1">Khôi phục mật khẩu <br> của bạn</span>
                        <span class="text-2">Chúng tôi sẽ giúp bạn lấy lại tài khoản</span>
                    </div>
                </div>
                <div class="forgot-password-form">
                    <div class="form-content">
                        <div class="forgot-form">
                            <div class="title">Quên mật khẩu</div>
                            <form @submit="handleForgotPassword">
                                <div class="input-boxes">
                                    <div class="input-box">
                                        <i class="bx bx-envelope"></i>
                                        <input 
                                            type="email" 
                                            placeholder="Nhập email để khôi phục" 
                                            v-model="forgotPasswordForm.email"

                                            required
                                        >
                                    </div>
                                    <div class="description-text">
                                        Chúng tôi sẽ gửi link khôi phục mật khẩu đến email của bạn
                                    </div>
                                    <div class="button input-box">
                                        <input type="submit" value="Gửi link khôi phục" @click="handleForgotPassword">
                                    </div>
                                    <div class="text back-to-login">
                                        <a href="#" @click.prevent="showForgotPassword">← Quay lại đăng nhập</a>
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

.login-page {
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

/* Container wrapper cho hiệu ứng 3D flip */
.container-wrapper {
    position: relative;
    max-width: 850px;
    width: 100%;
    height: 500px;
    perspective: 1000px;
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
    /* padding: var(--b); */
    transition: all 0.3s linear;
}

.container-wrapper.flipped .container-front {
    transform: rotateY(-180deg);
}

.container-wrapper.flipped .container-back {
    transform: rotateY(0deg);
}

.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 40px 30px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    transition: transform 0.8s ease-in-out;
}

.container-front {
    transform: rotateY(0deg);
}

.container-back {
    transform: rotateY(180deg);
}

/* Existing styles cho form đăng nhập/đăng ký */
.container .cover {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 50%;
    z-index: 98;
    transition: all 1s ease;
    transform-origin: left;
    transform-style: preserve-3d;
    backface-visibility: hidden;
}

.container #flip:checked~.cover {
    transform: rotateY(-180deg);
}

.container #flip:checked~.forms .login-form {
    pointer-events: none;
}

.container .cover .front,
.container .cover .back {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}

.cover .back {
    transform: rotateY(180deg);
}

.container .cover img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 10;
    border-radius: 0;
}

.container .cover .text {
    position: absolute;
    z-index: 10;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.container .cover .text::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0.35;
    background: linear-gradient(135deg, #7d2ae8 0%, #ff6a00 100%);
}

.cover .text .text-1,
.cover .text .text-2 {
    z-index: 20;
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    text-align: center;
}

.cover .text .text-2 {
    font-size: 15px;
    font-weight: 500;
}

.container .forms {
    height: 100%;
    width: 100%;
    background: #fff;
}

.container .form-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.form-content .login-form,
.form-content .register-form {
    width: calc(100% / 2 - 25px);
}

.forms .form-content .title {
    position: relative;
    font-size: 24px;
    font-weight: 500;
    color: #333;
}

.forms .form-content .title:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 25px;
    background: #dc3545;
}

.forms .form-content .title:before {
    width: 20px;
}

.forms .form-content .input-boxes {
    margin-top: 30px;
}

.forms .form-content .input-box {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    margin: 10px 0;
    position: relative;
}

.form-content .input-box input {
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

.form-content .input-box input:focus,
.form-content .input-box input:valid {
    border-color: #dc3545;
}

.form-content .input-box i {
    position: absolute;
    color: #dc3545;
    font-size: 17px;
}

.form-content .input-box .password-toggle {
    right: 10px;
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 10;
}

.form-content .input-box .password-toggle:hover {
    color: #a02834;
}

.forms .form-content .text {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.forms .form-content .text a {
    text-decoration: none;
}

.forms .form-content .text a:hover {
    text-decoration: underline;
}

.forms .form-content .button {
    color: #fff;
    margin-top: 40px;
}

.forms .form-content .button input {
    color: #fff;
    background: #dc3545;
    border-radius: 6px;
    padding: 0;
    cursor: pointer;
    transition: all 0.4s ease;
}

.forms .form-content .button input:hover {
    background: #c82333;
}

.forms .form-content label {
    color: #dc3545;
    cursor: pointer;
}

.forms .form-content label:hover {
    text-decoration: underline;
}

.forms .form-content .login-text,
.forms .form-content .sign-up-text {
    text-align: center;
    margin-top: 25px;
}

.container #flip {
    display: none;
}

/* Styles cho form quên mật khẩu */
.forgot-password-cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    z-index: 10;
}

.forgot-password-cover img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 10;
    border-radius: 0;
}

.forgot-password-cover .text {
    position: absolute;
    z-index: 20;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.forgot-password-cover .text::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0.35;
    background: linear-gradient(135deg, #7d2ae8 0%, #ff6a00 100%);
    z-index: 15;
}

.forgot-password-cover .text .text-1,
.forgot-password-cover .text .text-2 {
    z-index: 30;
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    text-align: center;
}

.forgot-password-cover .text .text-2 {
    font-size: 15px;
    font-weight: 500;
}

.forgot-password-form {
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

.forgot-password-form .form-content {
    width: 80%;
    max-width: 300px;
}

.forgot-form .title {
    position: relative;
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 30px;
}

.forgot-form .title:before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    height: 3px;
    width: 35px;
    background: #dc3545;
}

.forgot-form .input-boxes {
    margin-top: 20px;
}

.forgot-form .input-box {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    margin: 15px 0;
    position: relative;
}

.forgot-form .input-box input {
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

.forgot-form .input-box input:focus,
.forgot-form .input-box input:valid {
    border-color: #dc3545;
}

.forgot-form .input-box i {
    position: absolute;
    color: #dc3545;
    font-size: 17px;
}

.forgot-form .description-text {
    font-size: 13px;
    color: #666;
    text-align: center;
    margin: 15px 0;
    line-height: 1.4;
}

.forgot-form .button {
    color: #fff;
    margin-top: 25px;
}

.forgot-form .button input {
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

.forgot-form .button input:hover {
    background: #c82333;
}

.forgot-form .back-to-login {
    text-align: center;
    margin-top: 20px;
}

.forgot-form .back-to-login a {
    color: #dc3545;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
}

.forgot-form .back-to-login a:hover {
    text-decoration: underline;
}

@media (max-width: 730px) {

    .container .cover,
    .forgot-password-cover {
        display: none;
    }

    .form-content .login-form,
    .form-content .register-form,
    .forgot-password-form .form-content {
        width: 100%;
    }

    .form-content .register-form {
        display: none;
    }

    .container #flip:checked~.forms .register-form {
        display: block;
    }

    .container #flip:checked~.forms .login-form {
        display: none;
    }

    .forgot-password-form {
        position: relative;
        width: 100%;
        padding: 20px;
    }

    .forgot-password-form .form-content {
        max-width: 100%;
    }

    /* Điều chỉnh glow border cho mobile */
    .glow-border {
        --b: 4px;
    }
}
</style>