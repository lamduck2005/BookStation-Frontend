# BookStation-Frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Serve Production Build

```sh
npm run serve
```

## 🚀 Deployment & Security Notes

### **⚠️ Important Security Warnings**

1. **Never commit sensitive data**: Đảm bảo không có mật khẩu, API keys, hoặc thông tin nhạy cảm trong mã nguồn
2. **Environment variables**: Sử dụng biến môi trường cho tất cả thông tin cấu hình production
3. **HTTPS only**: Luôn sử dụng HTTPS trong production
4. **CORS configuration**: Backend phải được cấu hình CORS phù hợp với domain frontend

### **🔧 Production Deployment**

1. **Build ứng dụng**:
   ```sh
   npm run build
   ```

2. **Serve production build**:
   ```sh
   npm run serve
   ```

3. **Deploy to hosting**:
   - Upload thư mục `dist/` lên hosting
   - Cấu hình web server để serve static files từ `dist/`
   - Đặt fallback để tất cả routes đều trả về `index.html` (SPA routing)

### **📋 Deployment Checklist**

- [ ] Xóa tất cả console.log trong production
- [ ] Cấu hình biến môi trường production
- [ ] Setup HTTPS certificate
- [ ] Cấu hình CORS trên backend
- [ ] Test tất cả chức năng trên production
- [ ] Monitor performance và errors
- [ ] Setup backup và recovery plan

### **🏗️ Hosting Recommendations**

- **Vercel/Netlify**: Dễ deploy, tích hợp tốt với Git
- **AWS S3 + CloudFront**: Scalable, performance cao
- **Nginx**: Lightweight, customizable
- **Docker**: Portable deployment