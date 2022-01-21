import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { userLoggedOut } from "./store/usersSlice";
import PrivateRoute from "./auth/PrivateRoute";
import { useIdleTimer } from "react-idle-timer";
import { Home, Navbar, Footer, Login, Register, AddBook, EditBook, Checkout, Billing, AddPromotion, Transactions } from "./components";

function App() {
  //helpers
  const dispatch = useDispatch();

  //idle timer will logout user or manager after 30 minutes of inactivity
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1800000,
    onIdle: (e) => dispatch(userLoggedOut()),
  });

  //global state
  const loggedIn = useSelector((state) => state.users.loggedIn);
  const loggedOut = useSelector((state) => state.users.loggedOut);

  //local state
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  //side effects
  useEffect(() => {
    loggedIn && setToken(sessionStorage.getItem("token"));
    loggedIn && setToken(sessionStorage.getItem("token"));
  }, [loggedIn]);
  useEffect(() => {
    loggedOut && setToken(sessionStorage.getItem(null));
  }, [loggedOut]);

  return (
    <Box className="App">
      <BrowserRouter>
        <Navbar token={token} />

        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/add-book"
            element={
              <PrivateRoute>
                <AddBook />
              </PrivateRoute>
            }
          />
          <Route path="/checkout" element={<Checkout token={token} />} />
          <Route path="/billing" element={<Billing token={token} />} />
          <Route
            path="/add-promotion"
            element={
              <PrivateRoute>
                <AddPromotion />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-book/:id"
            element={
              <PrivateRoute>
                <EditBook />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Footer />
    </Box>
  );
}

export default App;
