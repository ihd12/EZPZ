import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL+"/api";

//카테고리별 아이템 가져오기
export const getCategoriesWithItems = async (checklistId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories/list/${checklistId}`);
        return response.data;
    } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
        return [];
    }
};

//카테고리 추가
export const addCategory = async (checklistId, categoryName) => {
    try {
        await axios.post(`${API_BASE_URL}/categories/${checklistId}`, { name: categoryName });
        return { success: true };
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return { success: false, message: "이미 존재하는 카테고리입니다." };
        }
        console.error("카테고리 추가 실패:", error);
        return { success: false, message: "카테고리 추가 중 오류 발생" };
    }
};

//카테고리 수정
export const updateCategory = async (categoryId, newName) => {
    try {
        await axios.put(`${API_BASE_URL}/categories/${categoryId}`, { name: newName });
        return true;
    } catch (error) {
        console.error("카테고리 수정 실패:", error);
        return false;
    }
};

//카테고리 삭제
export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
        return true;
    } catch (error) {
        console.error("카테고리 삭제 실패:", error);
        return false;
    }
};
