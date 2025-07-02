// categoryApi.js
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

export const getAllCategories = async () => {
  try {
    const { data } = await apiClient.get("/categories");
    console.log("Fetched categories:", data);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const getAllExceptId = async (id) => {
try {
  const { data } = await apiClient.get(`/categories/except/${id}`);
   return data;
} catch (error) {
   console.error("Error fetching categories:", error);
    throw error;
}
}
export const getAllParentCategories  = async () => {
  try {
    const { data } = await apiClient.get("/categories/parentcategories");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const addCategory = async (category) => {
  try {
    const { data } = await apiClient.post("/categories", category);
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (id, category) => {
  try {
    const { data } = await apiClient.put(`/categories/${id}`, category);
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Xoá danh mục
export const deleteCategory = async (id) => {
  try {
    const { data } = await apiClient.delete(`/categories/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (id) => {
  try {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};
