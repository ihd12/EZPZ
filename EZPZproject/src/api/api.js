import axios from "axios";

// 중복되는 API 요청을 정리하여 재사용 가능하도록 만듦
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL+"/api", // 백엔드 API 주소 확인
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance; // 반드시 export default 추가!
