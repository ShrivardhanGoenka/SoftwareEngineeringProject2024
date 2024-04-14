import React from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("auth-token") ? true : false;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;