import axios from "axios";
const API_URL = "/api/books";

export function getAllBooks() {
  return axios.get(API_URL);
}
export function getBookById(id) {
  return axios.get(`${API_URL}/${id}`);
}
export function createBook(data) {
  return axios.post(API_URL, data);
}
export function updateBook(id, data) {
  return axios.put(`${API_URL}/${id}`, data);
}
export function deleteBook(id) {
  return axios.delete(`${API_URL}/${id}`);
}
