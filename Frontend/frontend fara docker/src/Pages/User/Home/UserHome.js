import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './UserHome.module.css';

function UserPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [userDevices, setUserDevices] = useState([]);
  const { id: userIdFromURL } = useParams();
  console.log('User ID from URL:', userIdFromURL);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8082/spring-demo/user/currentUser')
      .then((response) => response.json())
      .then((data) => {
        const currentUserId = data.id;
        console.log('Current User ID:', currentUserId);

        if (userIdFromURL !== currentUserId) {
          navigate('/forbidden');
        } else {
          const userApiUrl = `http://localhost:8082/spring-demo/user/${userIdFromURL}`;
          const devicesApiUrl = `http://localhost:8081/spring-demo/device/user/${userIdFromURL}`;

          fetch(userApiUrl)
            .then((response) => response.json())
            .then((data) => setUserProfile(data));

          fetch(devicesApiUrl)
            .then((response) => response.json())
            .then((data) => setUserDevices(data));
        }
      });
  }, [userIdFromURL, navigate]);

  const userWelcome = userProfile ? `Welcome, ${userProfile.name}!` : '';

  return (
    <div className={styles['user-page-container']}>
      <h2>{userWelcome}</h2>

      <h3>Your devices:</h3>
      <table>
        <thead>
          <tr>
            <th>Device Name</th>
            <th>Description</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {userDevices.map((device) => (
            <tr key={device.id}>
              <td>{device.deviceName}</td>
              <td>{device.description}</td>
              <td>{device.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPage;
