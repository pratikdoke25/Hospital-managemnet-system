const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');


const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Hospital name
  registrationNumber: { type: String, unique: true, required: true }, // Unique registration number
  address: {
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  establishedDate: { type: Date },
  isActive: { type: Boolean, default: true },
  available_beds: { type: Number },
  total_beds: { type: Number },
  isActive: { type: Boolean, default: true }, // Add `isActive` field here
  password: {
    type: String,
    required: true
  },
})
const Hospital = mongoose.model('Hospital', hospitalSchema);







module.exports = Hospital;
