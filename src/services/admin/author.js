import axios from "axios";

const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// export const getAll = async()=> {
//   try {
//     const response = await apiClient.get("/authors");
//     return response.data; // Assuming the data is in the 'data' field of the response
//   } catch (error) {
//     console.error("Error fetching authors:", error);
//     throw error;
//   }
// }
// Lấy tất cả tác giả
export const getAllAuthors = async (params={}) => {
  try {
    const response = await apiClient.get("/authors/page",{params});
    return response.data.data; // Assuming the data is in the 'data' field of the response
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

export const addAuthor = async (author) => {
  try {
    const response = await apiClient.post("/authors", author);
    return response.data.data;
  } catch (error) {
    console.error("Error adding author:", error);
    throw error;
  }
};
export const updateAuthor = async (id, author) => {
  try {
    const response = await apiClient.put(`/authors/${id}`, author);
    return response.data.data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
};

export const deleteAuthor = async (id) => {
  try {
    const response = await apiClient.delete(`/authors/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw error;
  }
  
};

export const getAuthorById = async (id) => {
  try {
    const response = await apiClient.get(`/authors/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Đổi trạng thái tác giả
export const toggleStatus = async (id) => {
  try {
    const response = await apiClient.patch(`/authors/${id}/toggle-status`);
    return response.data.data;
  } catch (error) {
    console.error("Error toggling author status:", error);
    throw error;
  }
};
