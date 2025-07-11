import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL+"/api";

// JWT 토큰을 가져와 Authorization 헤더 추가
const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        // console.error("❌ 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        return {};
    }
    return { Authorization: `Bearer ${token}` };
};

// 체크리스트 목록 가져오기
export const getChecklists = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/checklist/list`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        // console.error("❌ 체크리스트 불러오기 실패:", error.response ? error.response.data : error.message);
        return [];
    }
};

// 체크리스트 추가
export const addChecklist = async (newChecklist) => {
    try {
        await axios.post(`${API_BASE_URL}/checklist/`, newChecklist, {
            headers: getAuthHeader(),
        });
        return true;
    } catch (error) {
        console.error("❌ 체크리스트 추가 실패:", error.response ? error.response.data : error.message);
        return false;
    }
};

// 체크리스트 수정
export const updateChecklist = async (id, checklistData) => {
    try {
        await axios.put(`${API_BASE_URL}/checklist/${id}`, checklistData, {
            headers: getAuthHeader(),
        });
        return true;
    } catch (error) {
        console.error("❌ 체크리스트 수정 실패:", error.response ? error.response.data : error.message);
        return false;
    }
};

// 체크리스트 삭제
export const deleteChecklist = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/checklist/${id}`, {
            headers: getAuthHeader(),
        });
        return true;
    } catch (error) {
        console.error("❌ 체크리스트 삭제 실패:", error.response ? error.response.data : error.message);
        return false;
    }
};

// 짐 싸기 초기화
export const resetPacking = async (checklistId) => {
    try {
        await axios.put(`${API_BASE_URL}/checklist/${checklistId}/reset`, null, {
            headers: getAuthHeader(),
        });
        return true;
    } catch (error) {
        console.error("❌ 짐 싸기 초기화 실패:", error.response ? error.response.data : error.message);
        return false;
    }
};
