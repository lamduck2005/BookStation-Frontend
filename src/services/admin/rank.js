// Gọi API lấy danh sách rank không dùng axios cấu hình sẵn
export const getRanks = async () => {
  const response = await fetch('http://localhost:8080/api/ranks');
  if (!response.ok) throw new Error('Lỗi khi lấy danh sách rank');
  return await response.json();
};
