import "./home.css";
import React, { useState, useEffect } from "react";
import { Box, Fade } from "@mui/material";
import jwt_decode from "jwt-decode";
import User from "./User";
import Admin from "./Admin";

function Home({ token }) {
  //local state
  const [fade, setFade] = useState(false);
  const [decoded, setDecoded] = useState(false);

  //side effects
  useEffect(() => {
    setFade(true);
  }, []);

  useEffect(() => {
    setDecoded(false); // Line bellow wont crash app. Undefined token wont be passed to decoder. Home will refresh when admin loggs out
    token && setDecoded(jwt_decode(token));
  }, [token]);

  return (
    <Fade in={fade} timeout={{ enter: 500 }}>
      <Box className="Home-wrapp">{decoded.role === "admin" ? <Admin /> : <User />}</Box>
    </Fade>
  );
}

export default Home;
