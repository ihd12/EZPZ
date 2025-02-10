import React from 'react';

const AirportTerminal = ({ terminal, getCongestionColor }) => {
  return (
    <div className="terminal-info">
      <h3>{terminal.terminal}</h3>
      <div className="occupancy-bar-container">
        <div
          className="occupancy-bar"
          style={{
            width: `${terminal.occupancy}%`,
            backgroundColor: getCongestionColor(terminal.occupancy),
          }}
        >
          {terminal.occupancy}%
        </div>
      </div>
      <p>
        여유 공간: {terminal.availableSpots} / {terminal.totalSpots}
      </p>
    </div>
  );
};

export default AirportTerminal;