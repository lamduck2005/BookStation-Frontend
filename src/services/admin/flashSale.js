import client from '../../utils/axios.js';

export const getAllFlashSale = async (pageOrParams = 0, size = 10, filters = {}) => {
    let params = {};

    if (typeof pageOrParams === 'object') {
        params = { ...pageOrParams };
    } else {
        params = {
            page: pageOrParams,
            size,
            ...filters
        };
    }

    return await client.get(`/api/flash-sales`, { params });
}

export const addFlashSale = async (data) => {
    return await client.post(`/api/flash-sales`, data);
}

export const updateFlashSale = async (id, data) => {
    return await client.put(`/api/flash-sales/${id}`, data);
}

export const toggleStatusFlashSale = async (id) => {
    return await client.patch(`/api/flash-sales/${id}/status`);
}

export const getTodayFlashSale = async () => {
    return await client.get(`/api/flash-sales/today`);
}

export const getFlashSaleStats = async () => {
    return await client.get(`/api/flash-sales/stats`);
};

