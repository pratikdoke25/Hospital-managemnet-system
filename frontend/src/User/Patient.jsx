import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Patient.css'; // Import CSS

function Patient() {

    const beds = async () => {
        try {
            const response = await fetch('http://localhost:3002/Admin/get_beds', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: hospital._id })
            });

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                setcount_beds(result)
            } else {
                console.error("Failed to get bed count.");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };
    const location = useLocation();
    const { hospital } = location.state || {};

    const [count_beds, setcount_beds] = useState(hospital.available_beds)

console.log(hospital)

    useEffect(() => {
        beds()
    }, [])
    const [form, setForm] = useState({
        name: '',
        phone: '',
        dob: '',
        gender: '',
        disease: '',
        bedNumber: '',
        admissionDate: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Appointment Registered Successfully!', {
            position: 'top-center',
            autoClose: 3000,
        });
    };

    return (
        <div className="container">
            <h1>Hospital & Patient Details</h1>
            <div className="details-wrapper">
                {/* Hospital Details */}
                <div className="hospital-details">
                    <h2>Hospital Details</h2>
                    <div className="detail-item"><span>Name:</span> {hospital.name}</div>
                    <div className="detail-item"><span>Registration Number:</span> {hospital?.registrationNumber}</div>
                    <div className="detail-item"><span>Available Beds:</span> {count_beds.response}</div>
                    <div className="detail-item"><span>Status:</span> {hospital?.isActive ? 'Active' : 'Inactive'}</div>
                    <div className="detail-item"><span>Phone:</span> {hospital?.contactDetails?.phone}</div>
                    <div className="detail-item"><span>Email:</span> {hospital?.contactDetails?.email}</div>
                </div>

                {/* Patient Registration Form */}
                <form onSubmit={handleSubmit}>
                    <h2>Patient Registration</h2>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        pattern="[0-9]{10,15}"
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="text"
                        name="disease"
                        value={form.disease}
                        onChange={handleChange}
                        placeholder="Diagnosed Disease"
                        required
                    />
                    <input
                        type="text"
                        name="bedNumber"
                        value={form.bedNumber}
                        onChange={handleChange}
                        placeholder="Assigned Bed Number"
                        required
                    />
                    <input
                        type="date"
                        name="admissionDate"
                        value={form.admissionDate}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Additional Notes"
                        style={{ height: '100px' }}
                    ></textarea>
                    <button type="submit">Register Patient</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Patient;
