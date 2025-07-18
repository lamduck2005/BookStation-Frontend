import { Ghn } from 'giaohangnhanh';

export const ghn = new Ghn({
    token: '0f28fcab-5a79-11f0-9b81-222185cb68c8', // Thay bằng token của bạn
    shopId: 197033, // Thay bằng shopId của bạn
    host: 'https://dev-online-gateway.ghn.vn',
    trackingHost: 'https://tracking.ghn.dev/',
    testMode: true, // Bật chế độ test sẽ ghi đè tất cả host thành môi trường sandbox
});

//          address	
// getProvinces()	Truy vấn tỉnh/thành phố	✅
// getDistricts()	Truy vấn quận/huyện	✅
// getWards()	Truy vấn phường/xã	✅
//          calculateFee
// getServiceList()	Truy vấn danh sách dịch vụ có sẵn dựa vào địa chỉ giao và nhận	✅
// calculateShippingFee()	Truy vấn phí giao hàng	✅
//             order
// calculateExpectedDeliveryTime()	Dự kiến thời gian giao hàng	✅
// pickShift()	Danh sách ca lấy đơn hàng	✅
// previewOrder()	Xem trước thông tin đơn hàng	✅
// createOrder()	Tạo đơn hàng	✅
// orderInfo()	Lấy thông tin chi tiết đơn hàng	✅
// cancelOrder()	Hủy đơn hàng	✅
// getTrackingUrl()	Lấy url theo dõi đơn hàng	✅
