const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Hospital = require('./../models/Admin.js'); // Correct import pat

const db = require('../db');

router.post('/signup', async (req, res) => {
    try {
        let data = req.body;
        const name = data.name;
        const checkadm = await Hospital.findOne({ name: name });
        if (checkadm) {
            return res.status(400).json({ error: 'Admin already exists. Try logging in.' });
        }

        const response = await new Hospital(data).save();
        console.log('Data saved');


        res.status(200).json({ response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});
router.post('/signin', async (req, res) => {
    try {
        let { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password.' });
        }

        // Search for the hospital by email inside contactDetails
        const hospital = await Hospital.findOne({ 'contactDetails.email': email });

        if (!hospital) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Check if the password matches
        if (password !== hospital.password) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // If email and password are correct
        res.status(200).json({ message: 'Login successful', hospital });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/hospital_list', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        if (hospitals) {
            res.status(200).json({ response: hospitals });

        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });

    }
});
router.put('/beds', async (req, res) => {
    try {
        let { id, available_beds } = req.body;
        if (!id || !available_beds) {
            return res.status(400).json({ error: 'Please provide data.' });
        }

        const checkadm = await Hospital.findOneAndUpdate(
            { _id: id },
            { available_beds },
            { new: true }
        );
        if (!checkadm) {
            return res.status(400).json({ error: 'Invalid data.' });
        }

        res.status(200).json({ admin: checkadm });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/get_beds', async (req, res) => {
    try {
        const { id } = req.body
        console.log(id)
        const hospitals = await Hospital.findById(id);
        console.log(hospitals.available_beds)
        if (hospitals) {
            res.status(200).json({ response: hospitals.available_beds });

        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });

    }
});

router.get('/hospital/:id',async (req, res) => {
    const { id } = req.params; // Get the hospital ID from request parameters
  
    try {
      // Fetch hospital details by ID
      const hospital = await Hospital.findById(id);
  
      // If hospital not found, send a 404 response
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }
  
      // Respond with the hospital details
      res.status(200).json({ success: true, response: hospital });
    } catch (error) {
      console.error('Error fetching hospital:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  router.put('/hospital/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body; // `isActive` boolean sent from the client to toggle status
  
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
      }
  
      // Update the status
      hospital.isActive = isActive;
  
      // Save the updated hospital data
      await hospital.save();
  
      res.status(200).json({ message: 'Hospital status updated successfully', response: hospital });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update hospital status' });
    }
  });

// ** Delete Hospital Controller **
router.delete('/hospital/del/:id', async (req, res) => {
    try {
      const { id } = req.params;

      console.log("Received ID:", id); // Add this log to check the received ID
  
      // Check if ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid hospital ID' });
      }

      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
      }

      // Delete the hospital
      await hospital.deleteOne();  // Use deleteOne() instead of remove()
  
      res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete hospital' });
    }
});

module.exports = router;

