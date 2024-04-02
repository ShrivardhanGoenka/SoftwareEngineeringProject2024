import logo from './logo.svg';
import './App.css';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import fonts from "./fonts/fonts.css"

import Navbar from "./Wrappers/Navbar";
import ProtectedRoute from "./Wrappers/ProtectedRoute";
import LoggedInRedirect from "./Wrappers/LoggedInRedirect";

import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Search from "./Pages/Search";
import Home from "./Pages/Home";
import Delivery from "./Pages/Delivery";
import Profile from "./Pages/Profile";
import Earn from "./Pages/Earn";
import { LoadScript } from '@react-google-maps/api';


function App() {
  return (
    <div className="m-auto" style={{width:"380px", border: "1px solid black", height:"100vh"}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        
        <Route path="/login" element={<LoggedInRedirect element={<Login />}/>} />
        <Route path="/signup" element={<LoggedInRedirect element={<SignUp />} />} />

        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />

        <Route path="/earn" element={<ProtectedRoute><Earn/></ProtectedRoute>}/>
        <Route path="/earn/pickup" element={<ProtectedRoute><h1>pickup</h1></ProtectedRoute>}/> 
        <Route path="/earn/journey" element={<ProtectedRoute><h1>ojuney</h1></ProtectedRoute>}/>
        <Route path="/hail-a-ride" element={<ProtectedRoute><h1>Hail a ride</h1></ProtectedRoute>} />
        <Route path="/delivery" element={ <ProtectedRoute><Delivery/></ProtectedRoute>} />
          <Route path="/delivery/waitpickup" element={<ProtectedRoute><h1>waiting pickup</h1></ProtectedRoute>}/> 
          <Route path="/delivery/customerJourney" element={<ProtectedRoute><h1>customerJourney</h1></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/logout" element={<ProtectedRoute><h1>Logout</h1></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
