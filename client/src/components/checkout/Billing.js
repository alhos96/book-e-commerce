import "./checkout.css";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Fade, Divider } from "@mui/material";
import { blockInvalidChar, parser } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../store/ordersSlice";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import jwt_decode from "jwt-decode";
import MyBackdrop from "../MyBackdrop";

function Billing({ token }) {
  //helpers
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const url = window.location.pathname;

  //global state
  const cartItems = useSelector((state) => state.orders.cartItems);

  //local state
  const [fade, setFade] = useState(false);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [decoded, setDecoded] = useState(false);

  //side effects
  useEffect(() => {
    setFade(true);
    parser(cartItems, setCart);
  }, []);

  useEffect(() => {
    token && setDecoded(jwt_decode(token));
  }, [token]);

  return (
    <>
      <MyBackdrop showBackdrop={showBackdrop} message={message} />

      <Fade in={fade} timeout={{ enter: 500 }}>
        <Box className="Billing-wrapp">
          <Divider textAlign="left" className="main-divider">
            <Typography>Finish order</Typography>
          </Divider>
          <Formik
            initialValues={{
              creditCard: "",
            }}
            validationSchema={yup.object({
              creditCard: yup
                .string()
                .min(16, "Please enter valid 16 digit card number!")
                .required("Please enter valid 16 digit card number!"),
            })}
            onSubmit={(values) => {
              axios
                .post(`http://localhost:5000/api/orders${url}`, { costumer: decoded.username, email: decoded.email, cartItems: cart })
                .then((res) => {
                  setShowBackdrop(true);
                  setMessage("Thank you for your purchase! Redirecting...");
                  setTimeout(() => {
                    navigate("/");
                  }, 3000);
                })
                .catch((err) => {
                  setMessage("Order failed!");
                });
              dispatch(resetCart());
            }}
          >
            <Form>
              <label htmlFor="creditCard">Credit Card:</label>
              <Field maxLength="16" className="text-input" onKeyDown={blockInvalidChar} type="text" name="creditCard"></Field>

              <ErrorMessage className="error" name="creditCard" component="p" />
              <Typography>{message}</Typography>
              <Button variant="contained" disableElevation type="submit" fullWidth className="button">
                Submit Order
              </Button>
            </Form>
          </Formik>
        </Box>
      </Fade>
    </>
  );
}

export default Billing;
