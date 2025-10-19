import { Ghn } from 'giaohangnhanh';

export const ghn = new Ghn({
    token: import.meta.env.VITE_GHN_TOKEN,
    shopId: parseInt(import.meta.env.VITE_GHN_SHOP_ID),
    host: import.meta.env.VITE_GHN_HOST,
    trackingHost: import.meta.env.VITE_GHN_TRACKING_HOST,
    testMode: import.meta.env.VITE_GHN_TEST_MODE === 'true',
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
