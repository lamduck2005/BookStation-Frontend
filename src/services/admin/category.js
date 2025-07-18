// categoryApi.js
import client from '@/utils/axios';

export const getAllCategories = async () => {
  try {
    const response = await client.get("/api/categories");
    console.log("Fetched categories:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const getAllExceptId = async (id) => {
try {
  const response = await client.get(`/api/categories/except/${id}`);
   return response.data.data;
} catch (error) {
   console.error("Error fetching categories:", error);
    throw error;
}
}
export const getAllParentCategories  = async (params={}) => {
  try {
    const response = await client.get("/api/categories/parentcategories", {params});
    console.log("Fetched parent categories:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addCategory = async (category) => {
  try {
    const response = await client.post("/api/categories", category);
    return response.data.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (id, category) => {
  try {
    const response = await client.put(`/api/categories/${id}`, category);
    return response.data.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Xoá danh mục
export const deleteCategory = async (id) => {
  try {
    const response = await client.delete(`/api/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (id) => {
  try {
    const response = await client.get(`/api/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};

// Lấy danh sách categories dropdown (cho trending filters)
export const getCategoriesDropdown = async () => {
  try {
    const response = await client.get("/api/categories/dropdown");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories dropdown:", error);
    
    // Fallback mock data
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      console.log('🔄 Using mock categories data');
      return {
        status: 200,
        message: "Mock categories data",
        data: [
          { id: 1, name: "Văn học" },
          { id: 2, name: "Kinh tế - Kinh doanh" },
          { id: 3, name: "Kỹ năng sống" },
          { id: 4, name: "Thiếu nhi" },
          { id: 5, name: "Học ngoại ngữ" },
          { id: 6, name: "Manga" },
          { id: 7, name: "Khoa học - Công nghệ" }
        ]
      };
    }
    
    throw error;
  }
};

// Đổi trạng thái danh mục
export const toggleStatus = async (id) => {
  try {
    const response = await client.patch(`/api/categories/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error("Error toggling category status:", error);
    throw error;
  }
};
export const getAllCategoriesForUser  = async () => {
  try {
    const response = await client.get("/api/categories/fiter");
    console.log("Fetched parent categories:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Lấy tất cả danh mục cha (parent-null)
export const getAllCategoriesParentNull = async () => {
  try {
    const response = await client.get("/api/categories/parent-null");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories with parent null:", error);
    throw error;
  }
};

// Lấy tất cả danh mục con theo id cha
export const getAllCategoriesByParentId = async (parentId) => {
  try {
    const response = await client.get(`/api/categories/parent/${parentId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories by parent id:", error);
    throw error;
  }
};
export const getAllCategoriesParentNotNull = async () => {
  try {
    const response = await client.get("/api/categories/parent-not-null");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories with parent null:", error);
    throw error;
  }
};

// ✅ ĐÚNG - Có 2 cách truyền id:

// Cách 1: Truyền id qua URL path
export const getAllCategoriesParentExcepNotNull = async (id) => {
  try {
    const response = await client.get(`/api/categories/parent-excep-not-null/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories with parent null:", error);
    throw error;
  }
};
