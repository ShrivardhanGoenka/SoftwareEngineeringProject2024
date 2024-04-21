import React from "react";
import { Navigate } from "react-router-dom";

const LoggedInRedirect = ({ element }) => {
    const isLoggedIn = localStorage.getItem("auth-token") ? true : false;
    return isLoggedIn ? <Navigate to="/" replace /> : element;
}

export default LoggedInRedirect;