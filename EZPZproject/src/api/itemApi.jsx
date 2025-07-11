import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
});

const itemApi = {
  searchItems: async (query) => {
    try {
      const username = localStorage.getItem('username');
      const response = await axiosInstance.get(`/api/items/search`, {
        params: {
          keyword: query,
          username: username
        }
      });
      return response.data;
    } catch (error) {
      console.error('물품 검색 실패:', error);
      throw error;
    }
  },

  getSearchRankings: async () => {
    try {
      const response = await axiosInstance.get('/api/search/top-categories');
      return response.data.map(item => ({
        name: item.category,
        count: item.searchCount
      }));
    } catch (error) {
      console.error('검색 랭킹 조회 실패:', error);
      return []; 
    }
  },

  saveSearchHistory: async (username, keyword, searchDate) => {
    try {
      const response = await axiosInstance.post('/api/search/history/save', {
        username,
        keyword,
        searchDate: searchDate || new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
      return false;
    }
  },

  getUserSearchHistory: async (username) => {
    try {
      const response = await axiosInstance.get(`/api/search/history`, {
        params: { username }
      });
      return response.data;
    } catch (error) {
      console.error('검색 기록 조회 실패:', error);
      throw error;
    }
  },

  // 최근 N일간의 검색 기록 조회 함수 추가
  getUserSearchHistoryByDays: async (username, days) => {
    try {
      const response = await axiosInstance.get(`/api/search/history/days`, {
        params: { username, days }
      });
      return response.data;
    } catch (error) {
      console.error(`최근 ${days}일간 검색 기록 조회 실패:`, error);
      throw error;
    }
  },

  getUserSearchHistoryPaginated: async (username, days, page = 1, pageSize = 10) => {
    try {
      const response = await axiosInstance.get(`/api/search/history/paginated`, {
        params: { username, days, page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error(`검색 기록 페이지네이션 조회 실패:`, error);
      throw error;
    }
  },

  getWeeklyRankings: async () => {
    try {
      const response = await axiosInstance.get('/api/search/weekly-ranking');
      return response.data.map(item => ({
        name: item.category,
        count: item.searchCount
      }));
    } catch (error) {
      console.error('주간 랭킹 조회 실패:', error);
      return [];
    }
  },

  getMonthlyRankings: async () => {
    try {
      const response = await axiosInstance.get('/api/search/monthly-ranking');
      return response.data.map(item => ({
        name: item.category,
        count: item.searchCount
      }));
    } catch (error) {
      console.error('월간 랭킹 조회 실패:', error);
      return [];
    }
  },
};

export default itemApi;
