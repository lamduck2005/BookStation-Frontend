import axios from "axios";
const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

export const getTotalSoldBooks = async () => {
  const res = await apiClient.get("/dashboard/stats/total-sold");
  return res.data.data;
};
export const getTotalStockBooks = async () => {
  const res = await apiClient.get("/dashboard/stats/total-stock");
  return res.data.data;
};
export const getTotalRevenue = async () => {
  const res = await apiClient.get("/dashboard/stats/total-revenue");
  return res.data.data;
};
export const getTopBookSold = async (limit = 5) => {
  const res = await apiClient.get("/dashboard/stats/top-sold", { params: { limit } });
  return res.data.data;
};
export const getAllBookStock = async () => {
  const res = await apiClient.get("/dashboard/stats/stock");
  return res.data.data;
};
export const getRevenueStats = async (...args) => {
  // Custom range: { startDate, endDate, groupBy }
  if (args.length === 1 && typeof args[0] === "object") {
    const { startDate, endDate, groupBy } = args[0];
    
    const res = await apiClient.get("/dashboard/stats/revenue", {
      params: {
        type: groupBy,     // 'day' | 'week' | 'month' | 'year'
        startDate,         // yyyy-MM-dd
        endDate,           // yyyy-MM-dd
      },
    });
    return res.data?.data ?? res.data;
  }

  // Preset: getRevenueStats('month', 2025, 8)
  const [type, year, month] = args;
  const res = await apiClient.get("/dashboard/stats/revenue", {
    params: { type, year, month },
  });
  return res.data?.data ?? res.data;
};
export const getMonthlySoldQuantity = async () => {
  const res = await apiClient.get("/dashboard/stats/sold-quantity");
  return res.data.data;
};
export const getTopSpenders = async (limit = 5) => {
  const res = await apiClient.get("/dashboard/stats/top-spenders", { params: { limit } });
  return res.data.data;
};
export const getTotalDeliveredOrders = async () => {
  const res = await apiClient.get("/dashboard/stat");
  return res.data.data;
};
export const getTotalUsers = async () => {
  const res = await apiClient.get("/dashboard/stats/total-users");
  return res.data.data;
};

export const getNetRevenueSummary = async () => {
  // Tính toán thời gian từ đầu tháng 8/2025 đến hiện tại
  const fromDate = new Date(2025, 7, 1); // Tháng 8 năm 2025 (tháng 0-indexed)
  const toDate = new Date(); // Hiện tại
  
  // Chuyển sang timestamp (milliseconds)
  const fromTimestamp = fromDate.getTime();
  const toTimestamp = toDate.getTime();
  
  const res = await apiClient.get("/orders/statistics/summary", {
    params: {
      period: "month",
      fromDate: fromTimestamp,
      toDate: toTimestamp
    }
  });
  
  // Trả về netRevenueSum từ response
  return res.data.data.netRevenueSum;
};