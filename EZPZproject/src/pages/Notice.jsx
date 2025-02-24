import React, { useState, useEffect } from "react";
import {createPost, updatePost, deletePost} from "../api/postApi";
import '../components/notice/Notice.css';
import { Link, useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage) : 1;
  });
  const postsPerPage = 10; // 페이지당 게시글 수
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, postId: null });
  const [searchType, setSearchType] = useState('title'); // 검색 타입 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 입력값
  const [activeSearch, setActiveSearch] = useState(""); // 실제 검색에 사용될 값
  const [isDetailView, setIsDetailView] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [username, setUsername] = useState(null);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 4; // 페이지당 댓글 수를 4개로 변경

  // 검색 실행 함수
  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  // 검색 필터 수정 (activeSearch 사용)
  const filteredPosts = posts.filter(post => {
    const searchLower = activeSearch.toLowerCase();
    switch (searchType) {
      case 'title':
        return post.title.toLowerCase().includes(searchLower);
      case 'writer':
        return (post.writer || '').toLowerCase().includes(searchLower);
      case 'content':
        return post.content.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  // 페이지네이션 처리
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', pageNumber.toString());
  };

  // 컴포넌트가 언마운트되거나 다른 페이지로 이동할 때 현재 페이지 저장
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8088/api/posts');  // API 엔드포인트 주소
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("게시글을 불러오는데 실패했습니다:", error);
    }
  };

  // 컴포넌트 마운트 시 게시글 목록 불러오기
  useEffect(() => {
    fetchPosts();
  }, []);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8088/api/member/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUsername();
    }
  }, []);

  // 글쓰기 버튼 클릭 핸들러 수정
  const handleAddClick = () => {
    setTitle("");  // 제목 초기화
    setContent("");  // 내용 초기화
    setEditId(null);  // 수정 ID 초기화
    setIsWriting(true);
    setIsDetailView(true);
    setSelectedPost(null);  // 선택된 게시글 초기화
  };

  // 게시글 등록/수정 함수
  const addOrUpdatePost = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
  
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const url = editId 
        ? `http://localhost:8088/api/posts/${editId}`
        : 'http://localhost:8088/api/posts';
      
      const postData = {
        title: title,
        content: content,
        writer: localStorage.getItem('username') || '작성자',  // 로컬 스토리지에서 username 가져오기
        createdAt: new Date().toISOString(),
        viewCount: 0
      };
  
      const response = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        // 에러 응답 내용 확인
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save post');
      }
      const savedPost = await response.json();
    
      // 게시글 목록 업데이트
      if (editId) {
        // 수정의 경우 해당 게시글만 업데이트
        setPosts(prevPosts =>
          prevPosts.map(post => 
            post.id === editId ? savedPost : post
          )
        );
      } else {
        // 새 게시글 추가의 경우 목록 맨 위에 추가
        setPosts(prevPosts => [savedPost, ...prevPosts]);
      }
      alert(editId ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
      setIsWriting(false);
      setTitle("");
      setContent("");
      setEditId(null);
      setSelectedPost(null);  // 선택된 게시글 초기화
      setIsDetailView(false); // 상세 보기 모드 해제
    } catch (error) {
      console.error('Error details:', error);
      alert('게시글 저장에 실패했습니다. ' + error.message);
    }
  };

  // 게시글 삭제 함수 수정
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // writer 정보 가져오기
      const writer = localStorage.getItem('username');
      if (!writer) {
        alert("작성자 정보를 찾을 수 없습니다.");
        return;
      }

      // URL에 writer 정보를 쿼리 파라미터로 추가
      const response = await fetch(`http://localhost:8088/api/posts/${id}?writer=${encodeURIComponent(writer)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        setIsDetailView(false);
        setSelectedPost(null);
        fetchPosts(); // 게시글 목록 새로고침
        window.history.pushState(null, '', '/board'); // URL 복구
      } else if (response.status === 403) {
        alert('삭제 권한이 없습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  // 브라우저 뒤로가기 버튼 처리
  useEffect(() => {
    const handlePopState = () => {
      if (isDetailView) {
        setIsDetailView(false);
        setSelectedPost(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDetailView]);

  // 게시글 상세보기로 이동할 때
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setIsDetailView(true);
    // URL 변경 (게시글 번호 추가)
    window.history.pushState(null, '', `/board/${post.id}`);
  };

  // 목록으로 돌아갈 때
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedPost(null);
    // URL을 원래대로 복구
    window.history.pushState(null, '', '/board');
  };

  // 삭제 확인 모달 표시 함수
  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, postId: id });
  };

  // 삭제 확인
  const confirmDelete = async () => {
    if (deleteConfirm.postId) {
      await handleDelete(deleteConfirm.postId);
      setDeleteConfirm({ show: false, postId: null });
    }
  };

  // 댓글 관련 함수들 수정
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8088/api/comments/post/${selectedPost.id}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8088/api/comments/post/${selectedPost.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: commentText,
          writer: localStorage.getItem('username') || '작성자'
        }),
      });

      if (response.ok) {
        setCommentText('');
        await fetchComments();
        // 새 댓글 추가 후 마지막 페이지로 이동
        const newTotalPages = Math.ceil((comments.length + 1) / commentsPerPage);
        setCurrentCommentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // 댓글 수정 버튼 클릭 핸들러 수정
  const handleEditButtonClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  // 댓글 수정 저장 핸들러
  const handleEditComment = async (commentId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8088/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: editCommentText,
          writer: localStorage.getItem('username') || '작성자'
        }),
      });

      if (response.ok) {
        setEditingCommentId(null);
        setEditCommentText('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:8088/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // useEffect로 댓글 불러오기
  useEffect(() => {
    if (selectedPost) {
      fetchComments();
    }
  }, [selectedPost]);

  // 댓글 페이지네이션 계산
  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalCommentPages = Math.ceil(comments.length / commentsPerPage);

  // 댓글 페이지 변경 핸들러
  const handleCommentPageChange = (pageNumber) => {
    setCurrentCommentPage(pageNumber);
  };

  return (
    <div className="container">
      {!isDetailView ? (
        // 게시글 목록 화면
        <div className="left-section">
          <h2 className="title">자유 게시판</h2>
          
          <div className="search-box">
            <select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-select"
            >
              <option value="title">제목</option>
              <option value="writer">작성자</option>
              <option value="content">내용</option>
            </select>
            <input
              type="text"
              placeholder={`${
                searchType === 'title' ? '제목' : 
                searchType === 'writer' ? '작성자' : '내용'
              } 검색...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              className="search-button"
            >
              검색
            </button>
            <button 
              onClick={handleAddClick}
              className="add-button"
              title="글쓰기"
            >
              글쓰기
            </button>
          </div>

          <div className="items-list">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
        <thead>
          <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-center w-16">No</th>
                    <th className="px-4 py-2 text-center flex-1">제목</th>
                    <th className="px-4 py-2 text-center w-24">작성자</th>
                    <th className="px-4 py-2 text-center w-24">날짜</th>
          </tr>
        </thead>
        <tbody>
                  {currentPosts.map((post, index) => (
                    <tr key={post.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{filteredPosts.length - ((currentPage - 1) * postsPerPage + index)}</td>
                      <td className="px-4 py-2">
                        <span 
                          onClick={() => handleViewPost(post)}
                          className="title-link title-ellipsis"
                          title={post.title}
                        >
                          {post.title.length > 15 ? post.title.slice(0, 15) + '...' : post.title}
                        </span>
                      </td>
                      <td className="px-4 py-2">{post.writer || '작성자'}</td>
                      <td className="px-4 py-2">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }) : '날짜 없음'}
                      </td>
            </tr>
          ))}
        </tbody>
      </table>
            </div>
          </div>

          <div className="pagination">
            <span 
              className="page-arrow" 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            >
              &lt;
            </span>
            {pageNumbers.map(number => (
              <span
                key={number}
                className={`page-number ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </span>
            ))}
            <span 
              className="page-arrow" 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            >
              &gt;
            </span>
          </div>
      </div>
      ) : (
        // 글작성/상세보기 화면
        <div className="detail-section">
          {isWriting ? (
            // 글작성 화면
            <>
              <div className="post-header">
                <h2 className="post-title">새 글 작성</h2>
              </div>
              <div className="post-body">
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="post-title-input"
                />
                <textarea
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="post-content-input"
                />
              </div>
              <div className="post-buttons">
                <div className="left-buttons">
                  <button 
                    onClick={() => {
                      setIsWriting(false);
                      setIsDetailView(false);
                      setTitle("");
                      setContent("");
                    }} 
                    className="button back-button"
                  >
                    목록으로
                  </button>
                </div>
                <div className="right-buttons">
                  <button 
                    onClick={addOrUpdatePost}
                    className="button edit-button"
                  >
                    {editId ? '수정완료' : '등록'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            // 상세보기 화면
            selectedPost && (
              <>
                <div className="post-header">
                  <h2 className="post-title">{selectedPost.title}</h2>
                  <div className="post-info">
                    <span className="post-writer">작성자: {selectedPost.writer}</span>
                    <span className="post-date">
                      작성일: {new Date(selectedPost.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="post-body">
                  <div className="post-content">{selectedPost.content}</div>
                </div>
                <div className="post-buttons">
                  <div className="left-buttons">
                    <button
                      onClick={handleBackToList}
                      className="button back-button"
                    >
                      목록으로
                    </button>
                  </div>
                  <div className="right-buttons">
                    {selectedPost.writer === localStorage.getItem('username') && (
                      <>
                        <button
                          onClick={() => {
                            if(window.confirm('게시글을 수정하시겠습니까?')) {
                              setTitle(selectedPost.title);
                              setContent(selectedPost.content);
                              setEditId(selectedPost.id);
                              setIsWriting(true);
                            }
                          }}
                          className="button edit-button"
                        >
                          수정하기
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm('정말 삭제하시겠습니까?')) {
                              handleDelete(selectedPost.id);
                            }
                          }}
                          className="button delete-button"
                        >
                          삭제하기
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 댓글 섹션 - 상세보기 화면에서만 표시 */}
                <div className="comments-section">
                  <h3>댓글 ({comments.length})</h3>
                  <div className="comment-form">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="댓글을 입력하세요"
                      className="comment-input"
                    />
                    <button onClick={handleAddComment} className="comment-submit">
                      등록
                    </button>
                  </div>
                  <div className="comments-list">
                    {currentComments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        {editingCommentId === comment.id ? (
                          // 수정 모드
                          <div className="comment-edit-form">
                            <input
                              type="text"
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="comment-input"
                            />
                            <div className="comment-edit-buttons">
                              <button
                                onClick={handleEditComment}
                                className="button edit-button"
                              >
                                저장
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditCommentText("");
                                }}
                                className="button cancel-button"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          // 일반 모드
                          <>
                            <div className="comment-content">
                              <span className="comment-author">{comment.writer}</span>
                              <span className="comment-text">{comment.content}</span>
                              <span className="comment-date">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {comment.writer === localStorage.getItem('username') && (
                              <div className="comment-buttons">
                                <button
                                  onClick={() => handleEditButtonClick(comment)}
                                  className="comment-edit"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="comment-delete"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 댓글 페이지네이션 추가 */}
                  {comments.length > 0 && (
                    <div className="comment-pagination">
                      <button
                        onClick={() => handleCommentPageChange(currentCommentPage - 1)}
                        disabled={currentCommentPage === 1}
                        className="page-arrow"
                      >
                        &lt;
                      </button>
                      {[...Array(totalCommentPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handleCommentPageChange(index + 1)}
                          className={`page-number ${currentCommentPage === index + 1 ? 'active' : ''}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handleCommentPageChange(currentCommentPage + 1)}
                        disabled={currentCommentPage === totalCommentPages}
                        className="page-arrow"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              </>
            )
          )}
        </div>
      )}

      
        {/* 삭제 확인 모달 추가 */}
        {deleteConfirm.show && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
              <h2 className="modal-title text-center">삭제 확인</h2>
              <p className="text-center mb-6">정말 이 게시글을 삭제하시겠습니까?</p>
              <div className="modal-buttons">
                <button
                  onClick={confirmDelete}
                  className="modal-submit bg-red-500 hover:bg-red-600"
                >
                  삭제
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, postId: null })}
                  className="modal-cancel"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default App;
