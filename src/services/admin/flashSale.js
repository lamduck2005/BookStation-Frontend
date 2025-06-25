import client from '../../utils/axios.js';

export const getAllFlashSale = async (page, size) => {
    return await client.get(`/api/flash-sales`, {
        params: {
            page,
            size
        }
    });
}

export const addFlashSale = async (data) => {
    return await client.post(`/api/flash-sales`, data);
}

export const updateFlashSale = async (id, data) => {
    return await client.put(`/api/flash-sales/${id}`, data);
}