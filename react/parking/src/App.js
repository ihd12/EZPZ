import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AirportParkingPage from './pages/AirportParkingPage';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<AirportParkingPage />} />
    </Routes>
  </Router>
  );
}
export default App;