import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  let [form, setForm] = useState({
    name: '',
    registrationNumber: '',
    available_beds: '',
    total_beds: '', // Added total_beds field
    address: {
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contactDetails: {
      phone: '',
      email: ''
    },
    establishedDate: '',
    isActive: true,
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prevForm) => ({
        ...prevForm,
        [parent]: {
          ...prevForm[parent],
          [child]: value
        }
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3002/Admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        toast.success('Registration successful!', {
          position: 'top-center'
        });
        setTimeout(() => navigate('/Hospital'), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      console.error(err);
      toast.error('Registration failed! Please try again.', {
        position: 'top-center'
      });
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Hospital Name"
        />
        <input
          name="registrationNumber"
          value={form.registrationNumber}
          onChange={handleChange}
          placeholder="Registration Number"
        />

        <div className="input-group">
          <input
            name="address.city"
            value={form.address.city}
            onChange={handleChange}
            placeholder="City"
          />
          <input
            name="address.state"
            value={form.address.state}
            onChange={handleChange}
            placeholder="State"
          />
        </div>

        <div className="input-group">
          <input
            name="address.postalCode"
            value={form.address.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
          />
          <input
            name="address.country"
            value={form.address.country}
            onChange={handleChange}
            placeholder="Country"
          />
        </div>

        <div className="input-group">
          <input
            name="contactDetails.phone"
            value={form.contactDetails.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <input
            name="contactDetails.email"
            value={form.contactDetails.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <input
          name="available_beds"
          type="number"
          value={form.available_beds}
          onChange={handleChange}
          placeholder="Available Beds"
        />
        
        <input
          name="total_beds" // Added total_beds field
          type="number"
          value={form.total_beds}
          onChange={handleChange}
          placeholder="Total Beds" // Placeholder for total beds
        />
        
        <input
          name="establishedDate"
          type="date"
          value={form.establishedDate}
          onChange={handleChange}
          placeholder="Established Date"
        />
        
        <div className="password-field">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="password-input"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="toggle-password"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit">Submit</button>
      </form>
      
      <p>
        Already have an account? 
        <Link to="/Hospital/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
