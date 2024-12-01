import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBed } from 'react-icons/fa';  
import './UserView.css'; // Import the CSS file
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
function User_view() {
  const [Hospital_list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await fetch('http://localhost:3002/Admin/hospital_list', {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setList(data.response);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/hospital/${id}`); // Navigate to the details page with the hospital ID
  };

  return (
    <>
    <Navbar/>
    <div className="hospital-list">
      <h1>Hospital List</h1>
      {isLoading ? (
        <p>Loading hospitals...</p>
      ) : Hospital_list.length > 0 ? (
        <div className="hospital-cards">
          {Hospital_list.map((hospital) => (
            <div
              key={hospital._id}
              className="hospital-card"
              onClick={() => handleCardClick(hospital._id)} 
            >
              <div className="hospital-info">
                <h3>{hospital.name}</h3>
                <p><strong>Registration Number:</strong> {hospital.registrationNumber}</p>
                <p><strong>City:</strong> {hospital.address?.city}</p>
                <p><strong>Contact:</strong> {hospital.contactDetails?.phone}</p>
              </div>
              <div className="hospital-actions">
                <div className="available-beds">
                  <FaBed size={20} color="green" />
                  <span>{hospital.available_beds || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hospitals found.</p>
      )}
    </div>
    <Footer/>
    </>
  );
}

export default User_view;
