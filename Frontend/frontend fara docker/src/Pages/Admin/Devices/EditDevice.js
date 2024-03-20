import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditDevice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { owner } = useParams();
  const [formData, setFormData] = useState({
    deviceName: '',
    description: '',
    address: '',
    ownerId: '', // Change ownerId to an empty string
  });
  const [users, setUsers] = useState([]); // Store the list of users

  useEffect(() => {

    fetch('http://localhost:8082/spring-demo/user/currentUser')
      .then((response) => response.json())
      .then((data) => {
        if (data.role !== 1) {
          navigate('/forbidden');
        }
      })
      .catch((error) => console.error(error));

    fetch(`http://localhost:8081/spring-demo/device/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
      })
      .catch((error) => console.log(error));
      
    // Fetch the list of users and populate the dropdown
    fetch('http://localhost:8082/spring-demo/user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error));
  }, [id, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    if (owner === '-1') {
      navigate(`/device`);
    } else {
      navigate(`/device/${owner}`);
    }
  };

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setFormData({ ...formData, ownerId: selectedUserId });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/spring-demo/device/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        if (owner === '-1') {
          navigate(`/device`);
        } else {
          navigate(`/device/${owner}`);
        }
      } else {
        console.log('Failed to update device');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Edit Device</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="deviceName">Device Name:</label>
          <input
            type="text"
            id="deviceName"
            name="deviceName"
            value={formData.deviceName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="ownerId">Owner ID:</label>
          <select
            id="ownerId"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleUserChange}
          >
            <option value="">Select an owner</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditDevice;
