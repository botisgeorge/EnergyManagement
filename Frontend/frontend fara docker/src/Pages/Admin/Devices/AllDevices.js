import React, { useState, useEffect } from 'react';
import styles from './AllDevices.module.css';
import { useNavigate } from 'react-router-dom';

function AllDevices() {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    fetch('http://localhost:8082/spring-demo/user/currentUser')
      .then((response) => response.json())
      .then((data) => {
        if (data.role !== 1) {
          navigate('/forbidden');
        }
      })
      .catch((error) => console.error(error));

    fetch(`http://localhost:8081/spring-demo/device`)
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/spring-demo/device/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDevices((prevDevices) => prevDevices.filter((device) => device.id !== id));
      } else {
        console.error('Failed to delete device');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-device/${id}/${'-1'}`);
  };

  return (
    <div className={styles['all-devices-container']}>
      <h2><button className={styles['back-button']} onClick={() => navigate('/admin')}>
        Users List
      </button>
      Devices List
      </h2>
      <table className={styles['all-devices-table']}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Device Name</th>
            <th>Description</th>
            <th>Address</th>
            <th>Owner ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.id}</td>
              <td>{device.deviceName}</td>
              <td>{device.description}</td>
              <td>{device.address}</td>
              <td>{device.ownerId}</td>
              <td>
                  <button
                    className={styles['edit-button']}
                    onClick={() => handleEdit(device.id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles['delete-button']}
                    onClick={() => handleDelete(device.id)}
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

export default AllDevices;
