import client from "../utils/axios.js";

export const register = async (req) => {
    return await client.post(`/api/auth/register`, req);
  };

export const login = async (req) => {
  return await client.post(`/api/auth/login`, req);
};

export const forgotPassword = async (email) => {
    return await client.post(`/api/auth/forgot-password`, { email });
};