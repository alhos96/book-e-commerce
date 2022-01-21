import "./checkout.css";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Fade, List, ListItem, Divider } from "@mui/material";
import { parser, blockInvalidChar } from "../../helpers";
import { itemAddedToCart } from "../../store/ordersSlice";
import Delete from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import Loader from "../Loader";
import Book from "../books/Book";
import * as yup from "yup";
import jwt_decode from "jwt-decode";

function Checkout({ token }) {
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
  const [discount, setDiscount] = useState("");
  const [decoded, setDecoded] = useState(false);
  const [disableCouponField, setDisableCouponField] = useState(false); //will become true if user enters correct coupon

  //side effects
  useEffect(() => {
    setFade(true);

    //cartItems in redux are array of json objects so they need to be parsed first
    parser(cartItems, setCart);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    //when user delets item in cart update redux
    dispatch(itemAddedToCart({ checkedBooks: cart.map((e) => JSON.stringify(e)) }));
    // eslint-disable-next-line
  }, [cart]);

  useEffect(() => {
    token && setDecoded(jwt_decode(token));
  }, [token]);

  //functions
  const deleteItem = ({ currentTarget }) => {
    setCart((prev) => prev.filter((book) => book.title !== currentTarget.id));
  };

  const total = (cart) => {
    let total = cart.reduce((a, b) => a + b.price, 0).toFixed(2);

    return total;
  };

  const calculateDiscount = (price, discount) => {
    let total = price * ((100 - discount) / 100);

    return total.toFixed(2);
  };

  return (
    <>
      <Fade in={fade} timeout={{ enter: 500 }}>
        <Box className="Checkout-wrapp">
          <Divider textAlign="left" className="main-divider">
            <Typography>Checkout</Typography>
          </Divider>
          {cart.length > 0 ? (
            <>
              <List>
                {cart.map((item, index) => {
                  return (
                    <ListItem key={`${item.title}${index}`}>
                      <Button size="large" id={item.title} onClick={deleteItem}>
                        <Delete />
                      </Button>

                      <Book title={item.title} price={item.price} />
                    </ListItem>
                  );
                })}
              </List>

              <Formik
                initialValues={{
                  coupon: "",
                }}
                validateOnChange
                validationSchema={yup.object({
                  coupon: yup.string().max(6, "jabuka"),
                })}
                onSubmit={(values) => {
                  console.log(values);
                }}
              >
                {({ values }) => {
                  if (values.coupon.length === 6) {
                    axios
                      .post(`http://localhost:5000/api/orders${url}`, values)
                      .then((res) => {
                        setMessage(res.data.message);
                        setDisableCouponField(true);
                        setDiscount(res.data.existingCoupon.percentageDiscount);
                      })
                      .catch((err) => {
                        setMessage("Coupon is not valid!");
                      });
                  }

                  return (
                    <Form>
                      <label htmlFor="coupon">{decoded?.member ? "Add Coupon:" : "Only members can use coupons!"}</label>
                      <Field
                        maxLength="6"
                        disabled={disableCouponField || !decoded?.member}
                        onKeyDown={blockInvalidChar}
                        className="text-input"
                        type="text"
                        name="coupon"
                      ></Field>
                      <ErrorMessage className="error" name="coupon" component="p" />
                      <Typography>{message}</Typography>

                      {discount ? (
                        <>
                          <Typography sx={{ mr: 2 }} align="right">
                            Total: $ {total(cart)}
                          </Typography>
                          <Divider></Divider>
                          <Typography sx={{ mr: 2 }} align="right">
                            With {discount}% discount: $ {calculateDiscount(total(cart), +discount)}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ mr: 2 }} align="right">
                          Total: $ {total(cart)}
                        </Typography>
                      )}
                      <br></br>
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => (token ? navigate("/billing") : navigate("/login"))}
                        type="submit"
                      >
                        {token ? "Checkout" : "Login to complete"}
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </>
          ) : (
            <Loader message={"Cart seems empty. Add items to cart to checkout.."} timeout={2000} buttonText={"go shop"} path={"/"} />
          )}
        </Box>
      </Fade>
    </>
  );
}

export default Checkout;
