// Thư viện tính phí ship dùng chung cho client
import { ghn } from '@/utils/giaohangnhanh'

export const DEFAULT_SHIPPING_FEE = 30000 // 30.000đ mặc định
export const BOOK_WEIGHT = 200            // 200g / quyển
const SERVICE_TYPE_ID = 2                // GHN dịch vụ tiêu chuẩn


export const calcShippingFee = async (address = {}, items = []) => {
  // Nếu thiếu thông tin địa chỉ → trả phí mặc định
  if (!address.wardCode || !address.districtId) {
    return DEFAULT_SHIPPING_FEE
  }

  // Tính tổng cân nặng
  const totalBooks = items.reduce((sum, i) => sum + (i.quantity || 0), 0)
  const totalWeight = totalBooks * BOOK_WEIGHT
  if (totalWeight <= 0) return 0 

  try {
    const res = await ghn.calculateFee.calculateShippingFee({
      service_type_id: SERVICE_TYPE_ID,
      to_ward_code: address.wardCode,
      to_district_id: address.districtId,
      weight: totalWeight
    })
    return res?.total || DEFAULT_SHIPPING_FEE
  } catch (error) {
    console.error('⚠️ Lỗi tính phí ship GHN:', error)
    return DEFAULT_SHIPPING_FEE
  }
}

