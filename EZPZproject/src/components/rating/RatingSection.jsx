import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import './RatingSection.css';

const StarRating = ({ rating, setRating, label }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating">
      <label>{label}</label>
      <div className="stars">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
              <FaStar
                className="star"
                size={30}
                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

const BASE_URL = process.env.REACT_APP_API_URL;

const RatingSection = ({ airport }) => {
    const [ratings, setRatings] = useState({
      satisfaction: 0,
      cleanliness: 0,
      convenience: 0
    });
    const [averageRatings, setAverageRatings] = useState(null);
  
    useEffect(() => {
      console.log('Current airport:', airport);
      if (airport && airport.id) {
        fetchAverageRatings(airport.id);
        setRatings({  // 공항 변경 시 별점 초기화
          satisfaction: 0,
          cleanliness: 0,
          convenience: 0
        });
      }
    }, [airport]);
  
    const fetchAverageRatings = async (airportId) => {
      try {
        const response = await axios.get(`${BASE_URL}/api/airports/${airportId}/ratings/average`);
        setAverageRatings(response.data);
      } catch (error) {
        console.error('평균 평점 조회 실패:', error);
      }
    };
  
    const handleRatingSubmit = async () => {
      if (!ratings.satisfaction || !ratings.cleanliness || !ratings.convenience) {
        alert('모든 항목을 평가해주세요.');
        return;
      }
  
      try {
        if (!airport || !airport.id) {
          throw new Error('공항 정보가 없습니다.');
        }
  
        const ratingData = {
          satisfaction: ratings.satisfaction,
          cleanliness: ratings.cleanliness,
          convenience: ratings.convenience
        };
        
        const response = await axios.post(
            `${BASE_URL}/api/airports/${airport.id}/ratings`,
            ratingData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.status === 200) {
          alert('평가가 성공적으로 제출되었습니다!');
          fetchAverageRatings(airport.id);
          setRatings({
            satisfaction: 0,
            cleanliness: 0,
            convenience: 0
          });
        }
      } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        alert('평가 제출에 실패했습니다');
      }
    };

  return (
    <div className="airport-rating-section">
      <h2>{airport ? (airport.name || '인천국제공항') : ''} 이용 만족도 평가</h2>
      
      {/* {averageRatings && (
        <div className="average-ratings">
          <h3>평균 평점</h3>
          <div className="ratings-grid">
            <div className="rating-item">
              <span>전반적 만족도:</span>
              <span>{(averageRatings.avgSatisfaction).toFixed(1)} / 5.0</span>
            </div>
            <div className="rating-item">
              <span>청결도:</span>
              <span>{(averageRatings.avgCleanliness).toFixed(1)} / 5.0</span>
            </div>
            <div className="rating-item">
              <span>이용 편의성:</span>
              <span>{(averageRatings.avgConvenience).toFixed(1)} / 5.0</span>
            </div>
          </div>
        </div>
      )} */}

      <div className="rating-form">
        <div className="rating-inputs">
          <StarRating
            rating={ratings.satisfaction}
            setRating={(value) => setRatings({...ratings, satisfaction: value})}
            label="전반적 만족도"
          />
          <StarRating
            rating={ratings.cleanliness}
            setRating={(value) => setRatings({...ratings, cleanliness: value})}
            label="청결도"
          />
          <StarRating
            rating={ratings.convenience}
            setRating={(value) => setRatings({...ratings, convenience: value})}
            label="이용 편의성"
          />
        </div>

        <button 
          className="submit-rating-button"
          onClick={handleRatingSubmit}
        >
          평가 제출하기
        </button>
      </div>
    </div>
  );
};

export default RatingSection;