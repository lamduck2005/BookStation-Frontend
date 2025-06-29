<script setup>
import router from '@/router'
import { showToast } from '@/utils/swalHelper'
import { ref } from 'vue'

// Reactive data cho form đăng nhập
const loginForm = ref({
    email: '',
    password: ''
})

// Reactive data cho form đăng ký
const signupForm = ref({
    fullName: '',
    email: '',
    password: ''
})

// Reactive data cho form quên mật khẩu
const forgotPasswordForm = ref({
    email: ''
})

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

// Hàm toggle form quên mật khẩu
const showForgotPassword = () => {
    isContainerFlipped.value = !isContainerFlipped.value
}

// Hàm xử lý đăng nhập
const handleLogin = (e) => {
    e.preventDefault()
    const email = loginForm.value.email

    if(email.startsWith('a')) {
        showToast('success', 'Đăng nhập thành công!')
        router.push('/admin')
    } else {
        showToast('success', 'Đăng nhập thành công!')
        router.push('/')
    }
}

// Hàm xử lý đăng ký
const handleSignup = (e) => {
    e.preventDefault()
    
    // Validation
    if (!signupForm.value.fullName || !signupForm.value.email || !signupForm.value.password) {
        showToast('error', 'Vui lòng nhập đầy đủ thông tin!')
        return
    }
    
    // Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupForm.value.email)) {
        showToast('error', 'Email không hợp lệ!')
        return
    }
    
    // Kiểm tra mật khẩu (ít nhất 6 ký tự)
    if (signupForm.value.password.length < 6) {
        showToast('error', 'Mật khẩu phải có ít nhất 6 ký tự!')
        return
    }
    
    // TODO: Gọi API đăng ký ở đây
    console.log('Signup data:', signupForm.value)
    
    showToast('success', 'Đăng ký thành công!')
    
    // Reset form
    signupForm.value = {
        fullName: '',
        email: '',
        password: ''
    }
}

// Hàm xử lý quên mật khẩu
const handleForgotPassword = (e) => {
    e.preventDefault()
    
    // Validation
    if (!forgotPasswordForm.value.email) {
        showToast('error', 'Vui lòng nhập email!')
        return
    }
    
    // Kiểm tra email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordForm.value.email)) {
        showToast('error', 'Email không hợp lệ!')
        return
    }
    
    // TODO: Gọi API quên mật khẩu ở đây
    console.log('Forgot password data:', forgotPasswordForm.value)
    
    showToast('success', 'Link khôi phục đã được gửi đến email của bạn!')
    
    // Reset form và quay lại trang đăng nhập
    forgotPasswordForm.value.email = ''
    isContainerFlipped.value = false
}

</script>

<template>
    <div class="login-page">
        <div class="stars">
            <div class="star" v-for="(star, idx) in stars" :key="idx" :style="{
                '--star-tail-length': star.tailLength,
                '--top-offset': star.topOffset,
                '--fall-duration': star.duration,
                '--fall-delay': star.delay
            }"></div>
        </div>

        <!-- Container wrapper cho hiệu ứng 3D flip -->
        <div class="container-wrapper" :class="{ 'flipped': isContainerFlipped }">
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
                            <span class="text-1">Hoàn thành hành trình dài <br> bằng một bước chân</span>
                            <span class="text-2">Hãy bắt đầu ngay</span>
                        </div>
                    </div>
                </div>
                <div class="forms">
                    <div class="form-content">
                        <div class="login-form">
                            <div class="title">Đăng nhập</div>
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
                                            type="password" 
                                            placeholder="Nhập mật khẩu" 
                                            v-model="loginForm.password"
                                            required
                                        >
                                    </div>
                                    <div class="text">
                                        <a href="#" @click.prevent="showForgotPassword">Quên mật khẩu?</a>
                                    </div>
                                    <div class="button input-box">
                                        <input type="submit" value="Đăng nhập">
                                    </div>
                                    <div class="text sign-up-text">Chưa có tài khoản? <label for="flip">Đăng ký
                                            ngay</label></div>
                                </div>
                            </form>
                        </div>
                        <div class="signup-form">
                            <div class="title">Đăng ký</div>
                            <form @submit="handleSignup">
                                <div class="input-boxes">
                                    <div class="input-box">
                                        <i class="bx bx-user"></i>
                                        <input 
                                            type="text" 
                                            placeholder="Nhập họ tên" 
                                            v-model="signupForm.fullName"
                                            required
                                        >
                                    </div>
                                    <div class="input-box">
                                        <i class="bx bx-envelope"></i>
                                        <input 
                                            type="email" 
                                            placeholder="Nhập email của bạn" 
                                            v-model="signupForm.email"
                                            required
                                        >
                                    </div>
                                    <div class="input-box">
                                        <i class="bx bx-lock"></i>
                                        <input 
                                            type="password" 
                                            placeholder="Nhập mật khẩu" 
                                            v-model="signupForm.password"
                                            required
                                        >
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
                                        <input type="submit" value="Gửi link khôi phục">
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

/* Container wrapper cho hiệu ứng 3D flip */
.container-wrapper {
    position: relative;
    max-width: 850px;
    width: 100%;
    height: 500px;
    perspective: 1000px;
    z-index: 1;
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
    border-radius: 15px;
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
    border-radius: 0 10px 10px 0;
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
    opacity: 0.5;
    background: #dc3545;
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
.form-content .signup-form {
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

.forms .signup-form .title:before {
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
    border-radius: 10px 0 0 10px;
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
    opacity: 0.5;
    background: #dc3545;
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
    .form-content .signup-form,
    .forgot-password-form .form-content {
        width: 100%;
    }

    .form-content .signup-form {
        display: none;
    }

    .container #flip:checked~.forms .signup-form {
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
}
</style>