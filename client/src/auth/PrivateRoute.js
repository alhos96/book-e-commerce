import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function PrivateRoute({ children }) {
  const [decoded, setDecoded] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    token && setDecoded(jwt_decode(token));
  }, [token]);

  return decoded?.role === "admin" ? children : <Navigate to="/" />;
}

export default PrivateRoute;
