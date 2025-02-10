const API_URL = 'http://localhost:8080/api/checklists';

// 체크리스트 불러오기
export const fetchChecklist = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}`);
  return response.json();
};

// 체크리스트 항목 추가
export const addChecklistItem = async (userId, category, item) => {
  await fetch(`${API_URL}/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, item, isChecked: false })
  });
};

// 체크 상태 업데이트
export const updateChecklistItem = async (id, isChecked) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isChecked })
  });
};

// 체크리스트 항목 삭제
export const deleteChecklistItem = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};
