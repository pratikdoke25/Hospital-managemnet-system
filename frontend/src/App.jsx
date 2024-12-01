// App.js
import React, { useState, createContext, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import User_view from './User/User_view.jsx';
import Login from './Hospital/Login.jsx';
import Register from './Hospital/Register.jsx';
import Patient from './User/Patient.jsx';
import Reception from './Hospital/Reception.jsx';
import HospitalDetails from './User/HospitalDetails';
import HospitalDetails1 from './Hospital/HospitalDetails1.jsx';
export const BedsContext = createContext(null); // Renaming to be clear
import Navbar from './Components/Navbar.jsx';
import Footer from './Components/Footer.jsx';
function App() {
  const [ava_beds, setbeds] = useState(10);
useEffect(()=>{
  console.log(ava_beds)
},[ava_beds,setbeds])
  return (
    <BedsContext.Provider value={{ava_beds, setbeds}}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/Hospital" element={<Login />} />
          <Route path="/" element={<User_view />} />
          <Route path="/hospital/:id" element={<HospitalDetails />} />
          <Route path="/Hospital/Details/:id" element={<HospitalDetails1 />} />
          <Route path="/user/patient" element={<Patient />} />
          <Route path="/Hospital/Reception" element={<Reception />} />
        </Routes>
      </BrowserRouter>
    </BedsContext.Provider>
  );
}

export default App;
