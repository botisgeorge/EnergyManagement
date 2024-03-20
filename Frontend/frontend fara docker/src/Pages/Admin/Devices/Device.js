import React, { useState, useEffect } from 'react';
import styles from './Device.module.css';
import { useNavigate, useParams } from 'react-router-dom';

function Devices() {
  const [devices, setDevices] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {

    fetch('http://localhost:8082/spring-demo/user/currentUser')
      .then((response) => response.json())
      .then((data) => {
        if (data.role !== 1) {
          navigate('/forbidden');
        }
      })
      .catch((error) => console.error(error));

    fetch(`http://localhost:8082/spring-demo/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        return fetch(`http://localhost:8081/spring-demo/device/user/${userId}`);
      })
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, [userId, navigate]);

  const handleAddDevice = () => {
    navigate(`/admin/addDevice/${userId}`);
  };

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

  const handleEdit = (id,owner) => {
    navigate(`/edit-device/${id}/${owner}`);
  };

  return (
    <div className={styles['devices-container']}>
      <h1>{user.name}'s List</h1>
      <button className={styles['back-button']} onClick={() => navigate(`/admin`)}>
        Back
      </button>
      <button className={styles['add-button']} onClick={handleAddDevice}>
        Add Device
      </button>
      <table className={styles['devices-table']}>
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
                    onClick={() => handleEdit(device.id,device.ownerId)}
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

export default Devices;
