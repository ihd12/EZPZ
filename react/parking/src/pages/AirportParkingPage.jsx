import React, { useState } from 'react';
import AirportCard from '../components/AirportCard';
import '../components/AirportParking.css';

const AirportParkingPage = () => {
  const [parkingData] = useState([
    {
      id: 1,
      name: '인천국제공항',
      terminals: [
        {
          terminal: 'T1',
          occupancy: 75,
          totalSpots: 1000,
          availableSpots: 250,
        },
        {
          terminal: 'T2',
          occupancy: 45,
          totalSpots: 800,
          availableSpots: 440,
        },
      ],
    },
    {
      id: 2,
      name: '김포국제공항',
      terminals: [
        {
          terminal: '국내선',
          occupancy: 85,
          totalSpots: 500,
          availableSpots: 75,
        },
      ],
    },
  ]);

  const getCongestionColor = (occupancy) => {
    if (occupancy >= 80) return '#ff4d4d';
    if (occupancy >= 50) return '#ffd700';
    return '#4CAF50';
  };

  return (
    <div className="airport-parking-container">
      <h1>전국 공항 주차장 혼잡도</h1>
      <div className="airports-grid">
        {parkingData.map((airport) => (
          <AirportCard
            key={airport.id}
            airport={airport}
            getCongestionColor={getCongestionColor}
          />
        ))}
      </div>
    </div>
  );
};

export default AirportParkingPage;