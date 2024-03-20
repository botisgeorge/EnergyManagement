import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './UserHome.module.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function UserPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [userDevices, setUserDevices] = useState([]);
  const { id: userIdFromURL } = useParams();
  const navigate = useNavigate();
  const token = useSelector(state => state.token);
  console.log(token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8082/spring-demo/user/currentUser', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const currentUser = await response.json();

        const currentUserId = currentUser.id;
        console.log('Current User ID:', currentUserId);

        if (userIdFromURL !== currentUserId) {
          navigate('/forbidden');
        } else {
          const userApiUrl = await fetch(`http://localhost:8082/spring-demo/user/${userIdFromURL}`, {
            
          });
          const devicesApiUrl = await fetch(`http://localhost:8081/spring-demo/device/user/${userIdFromURL}`, {
            
          });

          const userData = await userApiUrl.json();
          const devicesData = await devicesApiUrl.json();

          setUserProfile(userData);
          setUserDevices(devicesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

const connectWebSocket = async () => {
  try {

    await new Promise(resolve => setTimeout(resolve, 100));

    const socket = new SockJS('http://localhost:8083/spring-demo/notification');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected to WebSocket:', frame);

      stompClient.subscribe('/topic/notifications', async (message) => {
        const notificationMessage = message.body;
        console.log('Received notification:', notificationMessage);

        const ownerResponse = await fetch(`http://localhost:8081/spring-demo/device/getOwnerId/${notificationMessage}`);
        const ownerData = await ownerResponse.text();

        const currentUserResponse = await fetch('http://localhost:8082/spring-demo/user/currentUser');
        const currentUser = await currentUserResponse.json(); 

        console.log('user' + currentUser.id);
        console.log('owner' + ownerData);

        if (ownerData === currentUser.id) {
          const message = `Limit reached for device with ID ${notificationMessage}`;
          console.log(message);
          toast.info(message);
        }
      });

      return () => {
        stompClient.disconnect();
      };
    });
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
  }
};

connectWebSocket();
}, [navigate, userIdFromURL, token]);

const handleGraph = (deviceId) => {
  navigate(`/deviceGraph/${deviceId}`);
};

const handleTalkToAdministrator = () => {
    navigate(`/chat/${userIdFromURL}`);
  };

  const userWelcome = userProfile ? `Welcome, ${userProfile.name}!` : '';

  return (
    <div className={styles['user-page-container']}>
      <h2>{userWelcome}</h2>
      <button className={styles['talk-button']} onClick={handleTalkToAdministrator}>
          Talk to Administrator
        </button>

      <h3>Your devices:</h3>
      <table>
        <thead>
          <tr>
            <th>Device Name</th>
            <th>Description</th>
            <th>Address</th>
            <th>Max Value</th>
            <th>Graph</th>
          </tr>
        </thead>
        <tbody>
          {userDevices.map((device) => (
            <tr key={device.id}>
              <td>{device.deviceName}</td>
              <td>{device.description}</td>
              <td>{device.address}</td>
              <td>{device.maxValue}</td>
              <td>
                <button onClick={() => handleGraph(device.id)}>View Graph</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default UserPage;
