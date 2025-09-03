import axios from "axios"; // SỬA: import trực tiếp từ axios thay vì @/services/axios

const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// API tạo và tải xuống hóa đơn PDF
export const generateInvoicePDF = async (orderId) => {
  try {
    console.log("🧾 Generating invoice PDF for order ID:", orderId);
    console.log("🔗 Full API URL:", `${API_URL}/pdf/invoice/${orderId}`);
    
    // SỬA: Sử dụng apiClient thay vì axios và bỏ /api ở đầu vì đã có trong baseURL
    const response = await apiClient.get(`/pdf/invoice/${orderId}`, {
      responseType: 'blob', // QUAN TRỌNG: để nhận file PDF
      headers: {
        'Accept': 'application/pdf'
      }
    });

    console.log("📄 Response status:", response.status);
    console.log("📄 Response data size:", response.data.size, "bytes");

    if (response.status === 200) {
      // Kiểm tra xem file có trống không
      if (response.data.size === 0) {
        throw new Error("File PDF trống");
      }

      // Tạo URL blob cho file PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      
      // Tạo link download tự động
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `HoaDon_${orderId}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      // Ẩn link và trigger click để tự động download
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // Cleanup với delay nhỏ
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(pdfUrl);
      }, 100);
      
      console.log("✅ Invoice PDF downloaded successfully");
      
      return {
        success: true,
        message: "Hóa đơn đã được tải xuống thành công"
      };
    }
    
  } catch (error) {
    console.error("❌ Error generating invoice PDF:", error);
    console.error("❌ Full error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    });
    
    let errorMessage = "Không thể tạo hóa đơn PDF";
    if (error.response?.status === 404) {
      errorMessage = "Không tìm thấy đơn hàng";
    } else if (error.response?.status === 500) {
      errorMessage = "Lỗi server khi tạo hóa đơn";
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      errorMessage = "Không thể kết nối đến server";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    throw new Error(errorMessage);
  }
};

// API download trực tiếp với tên file tùy chỉnh
export const downloadInvoiceWithCustomName = async (orderId, customerName = "") => {
  try {
    console.log("🧾 Downloading invoice with custom name:", { orderId, customerName });
    
    // SỬA: Sử dụng apiClient và đường dẫn đúng
    const response = await apiClient.get(`/pdf/invoice/${orderId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    if (response.status === 200) {
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      
      // Tạo tên file với tên khách hàng (nếu có)
      const sanitizedCustomerName = customerName 
        ? customerName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
        : '';
      
      const fileName = sanitizedCustomerName 
        ? `HoaDon_${orderId}_${sanitizedCustomerName}_${new Date().toISOString().slice(0, 10)}.pdf`
        : `HoaDon_${orderId}_${new Date().toISOString().slice(0, 10)}.pdf`;
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(pdfUrl);
      }, 100);
      
      console.log("✅ Invoice downloaded with filename:", fileName);
      
      return { 
        success: true, 
        fileName,
        message: "Hóa đơn đã được tải xuống thành công"
      };
    }
  } catch (error) {
    console.error("❌ Error downloading invoice:", error);
    throw error;
  }
};

// API xem trước hóa đơn trong tab mới (optional)
export const previewInvoice = async (orderId) => {
  try {
    console.log("👁️ Previewing invoice:", orderId);
    
    const response = await apiClient.get(`/pdf/invoice/${orderId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    if (response.status === 200) {
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      
      // Mở PDF trong tab mới để xem trước
      const newWindow = window.open(pdfUrl, '_blank');
      
      if (!newWindow) {
        throw new Error("Popup bị chặn. Vui lòng cho phép popup để xem hóa đơn.");
      }
      
      // Cleanup sau 1 phút
      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 60000);
      
      return { success: true };
    }
  } catch (error) {
    console.error("❌ Error previewing invoice:", error);
    throw error;
  }
};