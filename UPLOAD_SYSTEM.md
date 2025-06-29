# Hệ thống Upload Ảnh BookStation

## Cách hoạt động

### 1. Kiến trúc hệ thống
- **Frontend**: Vue.js application (port 5173)
- **Upload Server**: Node.js Express server (port 3001) 
- **Backend API**: Spring Boot server (port 8080)

### 2. Luồng upload ảnh

```
1. User chọn ảnh từ giao diện Vue
2. AutoUploadImage component tự động upload lên Upload Server
3. Upload Server lưu file vào thư mục src/assets/uploads/events/
4. Upload Server trả về URL ảnh cho Frontend
5. Frontend hiển thị ảnh preview và lưu URL vào form
6. Khi submit form, Frontend gửi URL ảnh cùng với dữ liệu khác lên Backend API
7. Backend API lưu URL ảnh vào database
```

### 3. Cấu trúc thư mục upload

```
src/assets/uploads/events/
├── 2025/
│   ├── 01/
│   │   ├── image1735234567890_abc123.jpg
│   │   └── image1735234567891_def456.png
│   └── 02/
│       └── image1735234567892_ghi789.jpg
```

### 4. Components upload

#### AutoUploadImage.vue
- Upload 1 ảnh duy nhất
- Tự động upload khi chọn file
- Hiển thị preview real-time
- Hỗ trợ drag & drop
- Tự động nén ảnh (nếu > 500KB)

#### MultiImageUpload.vue  
- **Upload tối đa 5 ảnh cùng lúc**
- Tự động upload khi chọn file
- Hiển thị preview tất cả ảnh
- Giới hạn số lượng ảnh tối đa
- Hỗ trợ drag & drop nhiều file

### 5. Upload Server API

#### POST /api/upload/event-image
- Upload 1 ảnh
- Response: `{ success: true, url: "http://localhost:3001/uploads/events/2025/01/image123.jpg" }`

#### POST /api/upload/event-images  
- Upload nhiều ảnh
- Response: `{ success: true, urls: ["url1", "url2", ...] }`

#### DELETE /api/upload/event-image
- Xóa ảnh khỏi server
- Body: `{ imageUrl: "http://localhost:3001/uploads/events/2025/01/image123.jpg" }`

### 6. Cách chạy hệ thống

1. **Khởi động Upload Server:**
```bash
cd BookStation-Frontend
node upload-server.js
```

2. **Khởi động Frontend:**
```bash
npm run dev
```

3. **Khởi động Backend API:**
```bash
# Trong project Spring Boot
./mvnw spring-boot:run
```

### 7. Tại sao không dùng Base64?

❌ **Base64 có nhược điểm:**
- Kích thước tăng ~33% so với file gốc
- Gây chậm khi truyền dữ liệu
- Database bị phình to
- Không cache được ảnh

✅ **File upload có ưu điểm:**
- Kích thước nhỏ gọn
- Browser cache được ảnh
- Dễ quản lý và backup
- Có thể tối ưu hóa ảnh

### 8. Cấu hình quan trọng

#### upload-server.js
```javascript
const BASE_URL = 'http://localhost:3001'; // Thay đổi theo domain thực tế
const uploadsDir = 'src/assets/uploads/events'; // Thư mục lưu ảnh
```

#### upload.js
```javascript
const UPLOAD_SERVER_URL = 'http://localhost:3001'; // URL upload server
```

### 9. Lưu ý khi deploy

1. **Đổi BASE_URL** trong upload-server.js thành domain thực tế
2. **Cấu hình CORS** cho phép domain frontend
3. **Backup thư mục uploads** thường xuyên
4. **Cấu hình reverse proxy** nếu cần (nginx)

### 10. Troubleshooting

**Lỗi upload:**
- Kiểm tra upload server đã chạy chưa
- Kiểm tra thư mục uploads có quyền ghi
- Kiểm tra CORS settings

**Ảnh không hiển thị:**
- Kiểm tra URL ảnh có đúng không
- Kiểm tra file có tồn tại trong thư mục uploads
- Kiểm tra static file serving

### 11. Tính năng Fake Data

**Nút "Fake Data" trong popup thêm Event:**
- Tự động điền dữ liệu mẫu cho form
- Tên event có timestamp để tránh trùng lặp
- Ngày tháng random trong 7-30 ngày tới
- Địa điểm, mô tả, quy định được chọn ngẫu nhiên
- Giúp test nhanh không cần nhập thủ công

**Các field được fake:**
- ✅ Tên Event (với timestamp unique)
- ✅ Mô tả 
- ✅ Ngày bắt đầu/kết thúc (random)
- ✅ Số người tham gia tối đa
- ✅ Địa điểm
- ✅ Quy định
- ✅ Online/Offline (30% chance online)
- ✅ Loại sự kiện, Danh mục, Trạng thái (random từ dropdown)
- ⚠️ Phí tham gia: Để null, user tự điền nếu cần
- ⚠️ Ảnh: Cần upload thủ công

### 12. Lưu ý về Backend Response

Backend trả về response mới với các field:
- ✅ `entryFee` - Phí tham gia (có thể null)
- ✅ `statusName` - Tên trạng thái (hiển thị trực tiếp thay vì map từ số)
- ✅ `status` - Số trạng thái (0=Bản nháp, 1=Đã công bố, 2=Đang diễn ra, 3=Đã kết thúc, 4=Đã hủy)
- ✅ `createdAt`, `updatedAt` - Timestamp tạo/cập nhật
- ❌ `registrationDeadline` - Đã bỏ vì không có trong database

### 13. Lỗi đã sửa

- ✅ **Trạng thái không fill**: Đã sửa để dùng `statusName` từ backend
- ✅ **Trường bị lặp**: Đã xóa trường "Phí tham gia" và "Số người tham gia" bị duplicate
- ✅ **Status format**: Chuyển từ string 'DRAFT' sang number 0 theo backend
- ✅ **Dropdown status không hiển thị đúng**: Đảm bảo `status` là số và mapping đúng với dropdown options
- ✅ **EventStatuses fallback**: Thêm hardcode mapping nếu API không trả về đúng format

### 14. Status Mapping

Backend trả về `status` dạng số:
```
0 = "Bản nháp"
1 = "Đã công bố"  
2 = "Đang diễn ra"
3 = "Đã kết thúc"
4 = "Đã hủy"
```

Frontend đảm bảo:
- Dropdown options có `value` là số (0,1,2,3,4)
- Form binding `v-model="newEvent.status"` với giá trị số
- Edit modal convert `Number(event.status)` để đảm bảo type đúng
