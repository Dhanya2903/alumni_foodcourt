import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'https://alumni-foodcourt-2.onrender.com/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const getFoodByCategory = (category) => API.get(`/food/category/${category}`);
export const getAllFood = () => API.get('/food');
export const addFood = (foodData) => API.post('/food/add', foodData);
export const editFood = (id, foodData) => API.put(`/food/edit/${id}`, foodData);
export const deleteFood = (id) => API.delete(`/food/delete/${id}`);

export const createOrder = (orderData) => API.post('/order/create', orderData);
export const getUserOrders = (userId) => API.get(`/order/user/${userId}`);
export const getAllOrders = () => API.get('/order/all');
export const updateOrderStatus = (id, statusData) => API.put(`/order/status/${id}`, statusData);

export const createRazorpayOrder = (orderData) => API.post('/payment/create-order', orderData);
export const verifyRazorpayPayment = (paymentData) => API.post('/payment/verify-payment', paymentData);

export default API;
