import React from "react";
import Chart from "react-apexcharts";

const WeeklyProgressBarGraph = ({ weekData }) => {
  // Prepare data for the bar graph
  const hours = Array.from({ length: 24 }, (_, hour) => `${hour + 1}:00`);

const series = [{
  name: 'Unique Visits',
  data: hours.map(hour => {
    const hourKey = hour.split(':')[0]; // Get the hour part (e.g., '1' from '1:00')
    const foundData = weekData.find(dayData => dayData.visitHour === hourKey.padStart(2, '0')); // Pad single digits
    return foundData ? foundData.totalUniqueCount : 0; // Return count or 0 if not found
  }),
}];

  const options = {
    chart: {
      type: 'bar',
      height: '100%',
      toolbar: {
        show: true 
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '55%',
      },
    },
    xaxis: {
      categories: hours,
      title: {
        text: 'Hours',
      },
      labels: {
        show: true
      },
    },
    yaxis: {
      title: {
        text: 'Progress',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: 'top',
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="top-2 left-4 text-xl font-semibold text-gray-800">Peak Hours</h1>
      <Chart options={options} series={series} type="bar" height="95%" />
    </div>
  );
};

export default WeeklyProgressBarGraph;
