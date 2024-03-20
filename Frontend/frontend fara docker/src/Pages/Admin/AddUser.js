import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    address: '',
    age: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8082/spring-demo/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User added successfully!');
        navigate('/admin'); // Redirect to the admin page after successful user addition.
      } else {
        console.error('Failed to add user');
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
    }, [navigate]);

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add User</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default AddUser;
