import { Ghn } from 'giaohangnhanh';

export const ghn = new Ghn({
    token: '0f28fcab-5a79-11f0-9b81-222185cb68c8', // Thay bằng token của bạn
    shopId: 197033, // Thay bằng shopId của bạn
    host: 'https://dev-online-gateway.ghn.vn',
    trackingHost: 'https://tracking.ghn.dev/',
    testMode: true, // Bật chế độ test sẽ ghi đè tất cả host thành môi trường sandbox
});

// export const 
