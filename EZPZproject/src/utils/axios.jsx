import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        const response = await axios.post(process.env.REACT_APP_API_URL+'/api/auth/reissue', {
          accessToken: accessToken,
          username: username
        });
        
        const { accessToken: newAccessToken } = response.data;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

function clearAuthData() {
  // 인증 관련 데이터만 제거
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('mid');
  localStorage.removeItem('username');
  localStorage.removeItem('name');
  sessionStorage.removeItem('searchResults');
}

function clearStorageAndRedirect() {
  clearAuthData();
  window.location.href = '/login';
}

export default axiosInstance;