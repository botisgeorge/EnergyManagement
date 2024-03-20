import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate('/admin/addUser');
  };

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleChat = (userId) => {
    navigate(`/adminChat/${userId}`);
  };


  const handleDevices = (userId) => {
    navigate(`/device/${userId}`);
  };

  const handleDevicePage = () => {
    navigate(`/device`);
  };

  const handleDataPage = () => {
    navigate(`/data`);
  };

  const handleDelete = async (userId) => {
    try {
      const userResponse = await fetch(`http://localhost:8082/spring-demo/user/${userId}`, {
        method: 'DELETE',
      });
      if (!userResponse.ok) {
        console.error('Failed to delete user');
      } else {
        const devicesResponse = await fetch(`http://localhost:8081/spring-demo/device/deleteAll/${userId}`, {
          method: 'DELETE',
        });
        if (!devicesResponse.ok) {
          console.error('Failed to delete user devices');
        } else {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetch('http://localhost:8082/spring-demo/user/currentUser')
      .then((response) => response.json())
      .then((data) => {
        if (data.role !== 1) {
          navigate('/forbidden');
        }
      })
      .catch((error) => console.error(error));

    fetch('http://localhost:8082/spring-demo/user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  }, [navigate]);

  return (
    <div className={styles['admin-page-container']}>
      <div className={styles['admin-page-right']}>
      <h2 className={styles['admin-heading']}>
        <button className={styles['unpressable-button']} disabled>
            Users List
          </button>
          <button className={styles['devices-button']} onClick={handleDevicePage}>
            Devices List
          </button>
        </h2>
        <table className={styles['admin-table']}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Address</th>
              <th>Age</th>
              <th>ID</th>
              <th>Actions</th>
              <th>Devices</th>
              <th>Chat</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.address}</td>
                <td>{user.age}</td>
                <td>{user.id}</td>
                <td>
                  <button
                    className={styles['edit-button']}
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles['delete-button']}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button className={styles['devices-button']}
                    onClick={() => handleDevices(user.id)}
                  >
                    Devices
                  </button>
                </td>
                <td>
                <button className={styles['chat-button']}
                    onClick={() => handleChat(user.id)}
                  >
                    Open Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles['add-user-button']} onClick={handleAddUser}>
            Add User
          </button>
        <button className={styles['add-user-button']} onClick={handleDataPage}>
            Data
          </button>
      </div>
    </div>
  );
}

export default AdminPage;
