import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

import styles from './DeviceGraph.module.css';

function DeviceGraph() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [graphData, setGraphData] = useState(null);

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(chartRef.current, {
      type: 'line',
      data: {},
      options: {},
    });
  }, []);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate, id]);

  const fetchData = async (date) => {
    try {
      const response = await fetch(`http://localhost:8083/spring-demo/energyData/${id}/day?day=${date}`);
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.error('Invalid data format:', data);
        return;
      }

      console.log('Raw data:', data);

      const formattedData = {
        labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00'),
        datasets: [
          {
            label: 'Energy Consumption (kWh)',
            data: Array(24).fill(0),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      data.forEach((entry) => {
        if (entry.timestamp) {
          const [year, month, day, hours] = entry.timestamp;

          if (hours >= 0 && hours < 24) {
            formattedData.datasets[0].data[hours] = entry.measurement_value;
          } else {
            console.error('Invalid hour value:', hours);
          }
        } else {
          console.error('Invalid timestamp:', entry.timestamp);
        }
      });

      console.log('Formatted data:', formattedData);

      setGraphData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);

    fetchData(newDate);
  };

  return (
    <div className={styles.deviceGraphContainer}>
      <h1>Device Energy Consumption Graph</h1>

      <div className={styles.dateSelector}>
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {graphData ? (
        <div className={styles.chartContainer}>
          <div style={{ width: '80%', margin: '0 auto' }}>
            <Line ref={chartRef} data={graphData} />
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default DeviceGraph;
