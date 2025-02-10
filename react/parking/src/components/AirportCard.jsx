import React from 'react';
import AirportTerminal from './AirportTerminal';

const AirportCard = ({ airport, getCongestionColor }) => {
  return (
    <div className="airport-card">
      <h2>{airport.name}</h2>
      {airport.terminals.map((terminal) => (
        <AirportTerminal
          key={terminal.terminal}
          terminal={terminal}
          getCongestionColor={getCongestionColor}
        />
      ))}
    </div>
  );
};

export default AirportCard;