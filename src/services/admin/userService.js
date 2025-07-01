import axios from "axios";
const API_URL = "/api/users";

export function getAllUsers() {
  return axios.get(API_URL);
}
export function getUserById(id) {
  return axios.get(`${API_URL}/${id}`);
}
export function createUser(data) {
  return axios.post(API_URL, data);
}
export function updateUser(id, data) {
  return axios.put(`${API_URL}/${id}`, data);
}
export function deleteUser(id) {
  return axios.delete(`${API_URL}/${id}`);
}
