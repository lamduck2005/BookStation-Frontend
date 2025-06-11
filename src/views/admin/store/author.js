import axios from "axios";

const API_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

export const getAllAuthors = async () => {
  try {
    const { data } = await apiClient.get("/authors");
    console.log("Fetched authors:", data); // Log the fetched data
    return data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};
