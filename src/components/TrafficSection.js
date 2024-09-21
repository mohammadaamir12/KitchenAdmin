
import React from 'react';

const TrafficSection = ({ trafficNumber, percentChange,name }) => {
  return (
    <div className="traffic-section bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center justify-center transform rotate-y-[-5deg]">
        <div className="text-xl font-semibold mb-1">{name}</div>
      <div className="text-2xl font-semibold mb-2">{trafficNumber}</div>
      <div className={`text-base ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {percentChange >= 0 ? '▲' : '▼'} {Math.abs(percentChange)}%
      </div>
    </div>
  );
};

export default TrafficSection;
