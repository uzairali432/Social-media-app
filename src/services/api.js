import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('authToken', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Posts API calls
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  createPost: (postData) => api.post('/posts', postData),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  unlikePost: (postId) => api.post(`/posts/${postId}/unlike`),
};

// Users API calls
export const usersAPI = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.post(`/users/${userId}/unfollow`),
};

export default api;
