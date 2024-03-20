import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditEnergyData() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: '',
    timestamp: '',
    device_id: '',
    measurementValue: 0,
  });

  useEffect(() => {
    fetch(`http://localhost:8083/spring-demo/energyData/ownId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate('/data');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await fetch(`http://localhost:8083/spring-demo/energyData/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      navigate('/data');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Edit Energy Data</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="timestamp">Timestamp:</label>
          <input
            type="text"
            id="timestamp"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="device_id">Device ID:</label>
          <input
            type="text"
            id="device_id"
            name="device_id"
            value={formData.device_id}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="measurementValue">Measurement Value:</label>
          <input
            type="number"
            id="measurementValue"
            name="measurementValue"
            value={formData.measurementValue}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditEnergyData;
