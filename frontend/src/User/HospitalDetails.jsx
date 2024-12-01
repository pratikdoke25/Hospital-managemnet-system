import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './HospitalDetails.css';
import { toast } from 'react-toastify'; // Import React Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { ToastContainer } from 'react-toastify';
ChartJS.register(ArcElement, Tooltip, Legend);

function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    email: '',
    date: '',
  });

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/Admin/hospital/${id}`, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setHospital(data.response);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData({
      ...appointmentData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with an actual API request to submit the data
    toast.success('Appointment Submitted Successfully!');
    setIsModalOpen(false); // Close the modal after successful submission
  };

  const totalBeds = hospital?.total_beds || 0;
  const availableBeds = hospital?.available_beds || 0;
  const occupiedBeds = totalBeds - availableBeds;

  const data = {
    labels: ['Available Beds', 'Occupied Beds'],
    datasets: [{
      data: [availableBeds, occupiedBeds],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: ['#388E3C', '#D32F2F'],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const percentage = Math.round((context.raw / totalBeds) * 100);
            return `${context.label}: ${context.raw} beds (${percentage}%)`;
          },
        },
      },
    },
  };

  if (isLoading) return <p>Loading hospital details...</p>;

  if (!hospital) return <p>Hospital not found.</p>;

  return (
    <div className="hospital-details-container">
      <div className="hospital-details-left">
        <h1>{hospital.name}</h1>
        <p><strong>Registration Number:</strong> {hospital.registrationNumber}</p>
        <p><strong>City:</strong> {hospital.address?.city}</p>
        <p><strong>Contact:</strong> {hospital.contactDetails?.phone}</p>
        <p><strong>Available Beds:</strong> {hospital.available_beds}</p>
        <p><strong>Postal Code:</strong> {hospital.address?.postalCode}</p>
        <p><strong>Country:</strong> {hospital.address?.country}</p>
        <p><strong>Email:</strong> {hospital.contactDetails?.email}</p>
        <p><strong>Status:</strong> {hospital.isActive ? 'Open' : 'Closed'}</p>

        <button className="book-appointment-btn" onClick={() => setIsModalOpen(true)}>
          Book Appointment
        </button>
      </div>

      <div className="hospital-details-right">
        <h3>Bed Availability</h3>
        <Pie data={data} options={options} />
      </div>

      {/* Modal for booking appointment */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Book an Appointment</h2>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={appointmentData.name}
                onChange={handleAppointmentChange}
                required
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={appointmentData.email}
                onChange={handleAppointmentChange}
                required
              />
              <label>Appointment Date</label>
              <input
                type="date"
                name="date"
                value={appointmentData.date}
                onChange={handleAppointmentChange}
                required
              />
              <button type="submit">Submit</button>
            </form>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toastify Container with position set to top-center */}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default HospitalDetails;
