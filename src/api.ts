import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Crucial for sending the httpOnly refresh token cookie
});

// We will set these functions from our AuthContext to avoid circular dependencies
let getAccessToken: () => string | null = () => null;
let onLogout: () => void = () => { };
let onLoginSuccess: (data: any) => void = () => { };

export const setAuthHooks = (
    getAccessTokenFn: () => string | null,
    onLogoutFn: () => void,
    onLoginSuccessFn: (data: any) => void
) => {
    getAccessToken = getAccessTokenFn;
    onLogout = onLogoutFn;
    onLoginSuccess = onLoginSuccessFn;
};

// Request Interceptor: Runs before each request is sent
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Runs after a response is received
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await api.get('/auth/refresh-token');
                onLoginSuccess(data.data); // Update global auth state with new token
                originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
                return api(originalRequest); // Retry original request
            } catch (refreshError) {
                onLogout(); // If refresh fails, log the user out
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;