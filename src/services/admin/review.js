import client from '../../utils/axios.js';

export const getAllReview = async () => {
    return client.get('/api/reviews');
}