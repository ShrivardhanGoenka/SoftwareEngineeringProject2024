import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { Route, Navigate } from "react-router-dom";
import { useState } from "react";

const LoggedInRedirect = ({ element }) => {
    const isLoggedIn = localStorage.getItem("auth-token") ? true : false;
    return isLoggedIn ? <Navigate to="/" replace /> : element;
}

export default LoggedInRedirect;