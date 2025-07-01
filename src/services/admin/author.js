import axios from "axios";

const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// Lấy tất cả tác giả
export const getAllAuthors = async (params={}) => {
  try {
    const response = await apiClient.get("/authors",{params});
    console.log("Fetched authors:", response.data.data);
    return response.data.data; // Assuming the data is in the 'data' field of the response
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

export const addAuthor = async (author) => {
  try {
    const response = await apiClient.post("/authors", author);
    const {status,message,data} = response.data;

    return data;
  } catch (error) {
    console.error("Error adding author:", error);
    throw error;
  }
};
export const updateAuthor = async (id, author) => {
  try {
    const response = await apiClient.put(`/authors/${id}`, author);
    const {status,message,data} = response.data;

    return data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
};

export const deleteAuthor = async (id) => {
  try {
    const response = await apiClient.delete(`/authors/${id}`);
    const {status,message,data} = response.data;
    return data;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw error;
  }
  
};

export const getAuthorById = async (id) => {
  try {
    const response = await apiClient.get(`/authors/${id}`);
    const {status,message,data} = response.data;

    return data;
  } catch (error) {
    throw error;
  }
};
