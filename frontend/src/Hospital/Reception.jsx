import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Reception.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify';  // Import Toast functions
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS

function Reception() {
  const location = useLocation();
  const { data } = location.state || {};

  const [ava_beds, setbeds] = useState(data?.admin?.available_beds || 0);
  const [manualCount, setManualCount] = useState('');

  const update_bed = async () => {
    try {
      const response = await fetch('http://localhost:3002/Admin/beds', {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data?.admin?._id, available_beds: ava_beds })
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Bed count updated successfully!", {
          position: toast.POSITION.TOP_CENTER,  // Set position to top-center
        });
      } else {
        toast.error("Failed to update bed count.", {
          position: toast.POSITION.TOP_CENTER,  // Set position to top-center
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error updating bed count.", {
        position: toast.POSITION.TOP_CENTER,  // Set position to top-center
      });
    }
  };

  const handle_inc = () => setbeds((prev) => prev + 1);
  const handle_dec = () => ava_beds > 0 && setbeds((prev) => prev - 1);

  const handleManualChange = (e) => {
    setManualCount(e.target.value);
  };

  const handleManualSubmit = () => {
    const parsedCount = parseInt(manualCount, 10);
    if (!isNaN(parsedCount) && parsedCount >= 0) {
      setbeds(parsedCount);
      setManualCount('');
      alert(`Bed count set to ${parsedCount}`);  // Show alert after button click
    } else {
      alert("Please enter a valid number.");
    }
  };

  useEffect(() => {
    update_bed();
  }, [ava_beds]);

  return (
    <div className="reception-card">
      <h2 className="heading">Reception</h2>
      <div className="bed-controls">
        <p className="bed-info">Available Beds: {ava_beds}</p>
      </div>
      <div className="manual-input">
        <input
          type="number"
          value={manualCount}
          onChange={handleManualChange}
          placeholder="Enter bed count"
          className="input-field"
        />
        <button onClick={handleManualSubmit} className="button">Set Bed Count</button>
      </div>

      {/* ToastContainer to display the toast messages */}
      <ToastContainer />
    </div>
  );
}

export default Reception;
