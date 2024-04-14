import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Wrappers/ProtectedRoute";
import LoggedInRedirect from "./Wrappers/LoggedInRedirect";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import Delivery from "./Pages/Delivery";
import Ride from "./Pages/Ride";
import Profile from "./Pages/Profile";
import Earn from "./Pages/Earn";
import Wallet from "./Pages/Wallet";
import CurrentRequest from './Pages/CurrentRequest';
import CurrentRideRequester from './Pages/currentRideRequester';
import CurrentRideResponder from './Pages/CurrentRideResponder';
import CarDetails from './Pages/CarDetails';
import Feedback from './Pages/Feedback';
import History from "./Pages/History";

function App() {
  return (
    <div className="m-auto">
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<LoggedInRedirect element={<Login />}/>} />
              <Route path="/signup" element={<LoggedInRedirect element={<SignUp />} />} />
              <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
              <Route path="/ride" element={<ProtectedRoute><Ride /></ProtectedRoute>} />
              <Route path="/currentRequest" element={<ProtectedRoute><CurrentRequest /></ProtectedRoute>} />
              <Route path="/currentRide/requester" element={<ProtectedRoute><CurrentRideRequester /></ProtectedRoute>} />
              <Route path="/currentRide/responder" element={<ProtectedRoute><CurrentRideResponder /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
              <Route path="/earn" element={<ProtectedRoute><Earn/></ProtectedRoute>}/>
              <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
              <Route path="/profile/wallet" element={<ProtectedRoute><Wallet/></ProtectedRoute>} />
              <Route path="/profile/history" element={<ProtectedRoute><History/></ProtectedRoute>} />
              <Route path="/cardetails" element={<ProtectedRoute><CarDetails/></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet/></ProtectedRoute>} />
              <Route path="/logout" element={<ProtectedRoute><h1>Logout</h1></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
