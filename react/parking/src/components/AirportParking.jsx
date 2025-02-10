import React from 'react';

const AirportParking = ({ parkingData, onSpaceClick }) => {
  return (
    <div className="parking-container">
      <div className="parking-grid">
        {parkingData.map((space, index) => (
          <div
            key={index}
            className={`parking-space ${space.isOccupied ? 'occupied' : 'available'}`}
            onClick={() => onSpaceClick(index)}
          >
            <span className="space-number">{space.number}</span>
            <span className="space-status">
              {space.isOccupied ? '주차중' : '가능'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirportParking;