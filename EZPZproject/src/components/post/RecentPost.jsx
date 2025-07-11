import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentPost.css';
import arrow from '../../assets/img/arrow.png';

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+'/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      const latestPosts = data.slice(0, 5);
      setRecentPosts(latestPosts);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      // 게시글 상세 정보를 먼저 가져옵니다
      const response = await fetch(process.env.REACT_APP_API_URL+`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post detail');
      }
      
      // 상세 페이지로 이동하면서 상태도 함께 전달
      navigate(`/board/${postId}`, {
        state: {
          isDetailView: true
        }
      });
    } catch (error) {
      console.error('Error fetching post detail:', error);
    }
  };

  return (
    <div className="recent-posts">
      <div className="title-with-arrow">
        <h2>게시판</h2>
        <button onClick={() => navigate('/board')} className="more-button">
          <img src={arrow} alt="더보기" className="arrow-icon" />
        </button>
      </div>
      {loading ? (
        <div className="loading">로딩중...</div>
      ) : (
        <div className="posts-container">
          {recentPosts.map((post) => (
            <div key={post.id} className="post-row">
              <span 
                className="post-title" 
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                {post.title}
              </span>
              <div className="post-info">
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPosts;