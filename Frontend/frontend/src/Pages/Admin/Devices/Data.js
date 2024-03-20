import React, { useState, useEffect } from 'react';
import styles from './AllDevices.module.css';
import { useNavigate } from 'react-router-dom';

function AllData() {
  const [energyData, setEnergyData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8083/spring-demo/energyData')
      .then((response) => response.json())
      .then((data) => setEnergyData(data))
      .catch((error) => console.error(error));
  }, [navigate]);

  const handleEdit = (id) => {
    navigate(`/edit-data/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8083/spring-demo/energyData/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEnergyData((prevEnergyData) => prevEnergyData.filter((data) => data.id !== id));
      } else {
        console.error('Failed to delete energy data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles['all-devices-container']}>
      <h2>
        <button className={styles['back-button']} onClick={() => navigate('/admin')}>
          Back
        </button>
        <button className={styles['unpressable-button']} disabled>
          Energy Data List
        </button>
      </h2>
      <table className={styles['all-devices-table']}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Device ID</th>
            <th>Measurement Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {energyData.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.timestamp}</td>
              <td>{data.device_id}</td>
              <td>{data.measurement_value}</td>
              <td>
                <button
                  className={styles['edit-button']}
                  onClick={() => handleEdit(data.id)}
                >
                  Edit
                </button>
                <button
                  className={styles['delete-button']}
                  onClick={() => handleDelete(data.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllData;
