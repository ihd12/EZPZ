const BASE_URL = process.env.REACT_APP_API_URL+"/api";

export async function getPosts() {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getPostDetail(postId) {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post detail");
  }
  return response.json();
}

export async function addOrUpdatePost({ editId, title, content }) {
  const token = localStorage.getItem("accessToken");
  const writer = localStorage.getItem("username") || "작성자";
  const url = editId
    ? `${BASE_URL}/posts/${editId}`
    : `${BASE_URL}/posts`;

  const postData = {
    title,
    content,
    writer,
    createdAt: new Date().toISOString(),
    viewCount: 0,
  };

  const response = await fetch(url, {
    method: editId ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save post");
  }
  return response.json();
}

export async function deletePost(postId) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  const writer = localStorage.getItem("username");
  const response = await fetch(
    `${BASE_URL}/posts/${postId}?writer=${encodeURIComponent(writer)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("삭제 권한이 없습니다.");
    } else {
      throw new Error("게시글 삭제에 실패했습니다.");
    }
  }
}
