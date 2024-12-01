import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HospitalDetails1.css';
import { FaEdit } from 'react-icons/fa';

function HospitalDetails1() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [ava_beds, setBeds] = useState(0);
  const [manualCount, setManualCount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/Admin/hospital/${id}`, {
          method: 'GET',
        });
        const data = await response.json();
        if (response.ok) {
          setHospital(data.response);
          setIsActive(data.response.isActive);
          setBeds(data.response.available_beds);
        } else {
          console.error('Error fetching hospital details:', data.error);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  const toggleActiveStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3002/Admin/hospital/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setIsActive((prevStatus) => !prevStatus);
      } else {
        console.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteHospital = async () => {
    try {
      const response = await fetch(`http://localhost:3002/Admin/hospital/del/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigate('/hospitals');
      } else {
        console.error('Failed to delete hospital');
      }
    } catch (err) {
      console.error('Error deleting hospital:', err);
    }
  };

  const handleManualChange = (e) => setManualCount(e.target.value);
  const handleManualSubmit = () => {
    const parsedCount = parseInt(manualCount, 10);
    if (!isNaN(parsedCount) && parsedCount >= 0) {
      setBeds(parsedCount);
      setManualCount('');
      setIsModalOpen(false); // Close modal after updating bed count
      alert(`Bed count set to ${parsedCount}`);
    } else {
      alert("Please enter a valid number.");
    }
  };

  // Modal close handler
  const closeModal = () => setIsModalOpen(false);
  // Modal open handler
  const openModal = () => setIsModalOpen(true);

  if (isLoading) return <p>Loading hospital details...</p>;
  if (!hospital) return <p>Hospital not found.</p>;

  return (
    <div className="hospital-details-container">
      <div className="hospital-details-left">
        <h1>{hospital.name}</h1>
        <p><strong>Registration Number:</strong> {hospital.registrationNumber}</p>
        <p><strong>City:</strong> {hospital.address?.city}</p>
        <p><strong>Contact:</strong> {hospital.contactDetails?.phone}</p>
        <div className="available-beds-section">
          <p><strong>Available Beds:</strong> {ava_beds}</p>
          <button onClick={openModal}>Update Bed Count</button>
        </div>
        <p><strong>Total Bed Count:</strong> {hospital.total_beds}</p>
        <p><strong>Postal Code:</strong> {hospital.address?.postalCode}</p>
        <p><strong>Country:</strong> {hospital.address?.country}</p>
        <p><strong>Email:</strong> {hospital.contactDetails?.email}</p>
        <div className="status-section">
        <p><strong>Status:</strong> {isActive ? 'Open' : 'Closed'}</p>
<button onClick={toggleActiveStatus}>
  {isActive ? 'Deactivate' : 'Activate'}
</button>

          <button onClick={deleteHospital} style={{ color: 'red' }}>Delete</button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Bed Count</h2>
            <input
              type="number"
              value={manualCount}
              onChange={handleManualChange}
              placeholder="Enter new bed count"
            />
            <button onClick={handleManualSubmit}>Submit</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalDetails1;
