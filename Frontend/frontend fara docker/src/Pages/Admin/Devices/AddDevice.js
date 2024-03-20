import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddDevice() {
  const [formData, setFormData] = useState({
    deviceName: '',
    description: '',
    address: '',
    ownerId: '',
  });

  const navigate = useNavigate();
  const { userId } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ownerId: userId,
    });
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

  const handleCancel = () => {
    navigate(`/device/${userId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8081/spring-demo/device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceName: formData.deviceName,
          description: formData.description,
          address: formData.address,
          ownerId: formData.ownerId,
        }),
      });

      console.log(formData);
  
      if (response.ok) {
        console.log('Device added successfully!');
        navigate(`/device/${userId}`); // Redirect to the devices page for the user after successful device addition.
      } else {
        console.error('Failed to add device');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add Device</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="deviceName">Device Name:</label>
          <input
            type="text"
            id="deviceName"
            name="deviceName"
            value={formData.deviceName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
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
          <label htmlFor="ownerId">Owner ID:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={userId}
            readOnly
          />
        </div>
        <button type="submit">Add Device</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default AddDevice;
