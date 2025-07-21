# 🔧 REFUND DEBUG GUIDE - FIXED VERSION

## 🚨 **CÁC LỖI ĐÃ SỬA**

### 1. **❌ Upload thành công nhưng URLs biến mất**
**Trước:** Timer 2000ms → thông báo biến mất quá nhanh
**Sau:** Hiển thị popup với URLs chi tiết, không có timer

### 2. **❌ Lỗi "không tìm thấy chi tiết đơn hàng"**
**Trước:** Validation logic sai
**Sau:** Debug chi tiết + validation rõ ràng

---

## 🧪 **TESTING STEPS**

### **Step 1: Test Upload URLs**
1. **Upload ảnh** → Check console & popup hiển thị URLs
2. **Upload video** → Check console & popup hiển thị URLs
3. **URLs phải được lưu vào:**
   - `evidenceImages` array
   - `evidenceVideos` array

### **Step 2: Debug Order Details**
1. **Click nút "Hoàn hàng"** 
2. **Check console logs:**
   ```
   === DEBUG: Opening refund modal ===
   Order object: {...}
   Order details: [...]
   Order details count: X
   ```

### **Step 3: Debug Refund Creation**
1. **Fill form và submit**
2. **Check console logs:**
   ```
   DEBUG: Creating FULL/PARTIAL refund details
   DEBUG: Available order details: [...]
   DEBUG: Final refundDetails: [...]
   === DEBUG: Submitting refund request ===
   Evidence Images URLs: [...]
   Evidence Videos URLs: [...]
   ```

---

## 🎯 **EXPECTED CONSOLE OUTPUT**

```javascript
// Upload ảnh thành công
Image upload success: [
  "/uploads/refund-evidence/2025/07/image123.jpg",
  "/uploads/refund-evidence/2025/07/image456.png"
]

// Upload video thành công  
Video upload success: [
  "/uploads/refund-evidence/2025/07/video789.mp4"
]

// Mở modal hoàn hàng
=== DEBUG: Opening refund modal ===
Order details count: 2

// Tạo refund details
DEBUG: Creating FULL refund details
DEBUG: Final refundDetails: [
  {
    bookId: 123,
    refundQuantity: 1,
    reason: "Sản phẩm bị lỗi",
    evidenceImages: ["/uploads/..."],
    evidenceVideos: ["/uploads/..."]
  }
]

// Submit request
=== DEBUG: Submitting refund request ===
Evidence Images URLs: ["/uploads/..."]
Evidence Videos URLs: ["/uploads/..."]
```

---

## 🚨 **NẾU VẪN LỖI**

### **Lỗi: "Đơn hàng không có sản phẩm nào"**
- Check: `Order details count: 0`
- **Nguyên nhân:** API `/api/orders/user/{userId}` không trả về `orderDetails`
- **Fix:** Cần update API hoặc load order details riêng

### **Lỗi: "refundDetails is empty"**
- Check: `DEBUG: Final refundDetails: []`
- **Nguyên nhân:** Logic tạo refundDetails failed
- **Fix:** Check `bookId`, `quantity` mapping

### **Lỗi: Upload không trả về URLs**
- Check: `Image upload success: []`
- **Nguyên nhân:** API response structure khác
- **Fix:** Check `response.data` vs `response.data.data`

---

## ✅ **SUCCESS INDICATORS**

1. ✅ **Upload popup hiển thị URLs rõ ràng**
2. ✅ **Console show order details > 0**
3. ✅ **refundDetails array không empty**
4. ✅ **API call `/api/orders/91/request-refund` được gọi**
5. ✅ **Server response 200 hoặc error message rõ ràng**

**🎯 Test lại và report console logs để debug tiếp!**
