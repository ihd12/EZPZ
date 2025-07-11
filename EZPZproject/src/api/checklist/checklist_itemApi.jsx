import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL+"/api";

//아이템 목록 가져오기
export const getItems = async (categoryId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/items/list/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("아이템 불러오기 실패:", error);
        return [];
    }
};

//아이템 추가
export const addItem = async (categoryId, itemName) => {
    try {
        await axios.post(`${API_BASE_URL}/items/${categoryId}`, { name: itemName });
        return { success: true };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return { success: false, message: "이미 존재하는 아이템입니다." };
        }
        console.error("아이템 추가 실패:", error);
        return { success: false, message: "아이템 추가 중 오류 발생" };
    }
};

//아이템 수정
export const updateItem = async (itemId, newName) => {
    try {
        await axios.put(`${API_BASE_URL}/items/${itemId}`, { name: newName });
        return true;
    } catch (error) {
        console.error("아이템 수정 실패:", error);
        return false;
    }
};

//아이템 삭제
export const deleteItem = async (itemId) => {
    try {
        await axios.delete(`${API_BASE_URL}/items/${itemId}`);
        return true;
    } catch (error) {
        console.error("아이템 삭제 실패:", error);
        return false;
    }
};

//아이템 체크 상태 변경
export const toggleItemCheck = async (itemId, checked) => {
    try {
        await axios.put(`${API_BASE_URL}/items/${itemId}/checked`, { checked: !checked });
        return true;
    } catch (error) {
        console.error("아이템 체크 상태 변경 실패:", error);
        return false;
    }
};
