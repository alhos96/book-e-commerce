import React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token");

  return jwt_decode(token)?.role === "admin" ? children : <Navigate to="/" />;
}

export default PrivateRoute;
