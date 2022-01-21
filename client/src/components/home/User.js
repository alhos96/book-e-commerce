import "./home.css";
import React, { useEffect } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { methods } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { getBooks, itemAddedToCart } from "../../store/ordersSlice";
import Book from "../books/Book";
import { Formik, Form, Field } from "formik";
import Cart from "../cart/Cart";
import Loader from "../Loader";

function User() {
  //helpers
  const dispatch = useDispatch();
  const { get } = methods;

  //global state
  const books = useSelector((state) => state.orders.books);
  const cartItems = useSelector((state) => state.orders.cartItems);

  //side effects
  useEffect(() => {
    dispatch(getBooks("/api/books", get));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {books.length > 0 ? (
        <Box className="Books-list">
          <Divider textAlign="left" className="main-divider">
            <Typography>Shop</Typography>
          </Divider>
          <Formik
            initialValues={{
              checkedBooks: cartItems,
            }}
            onSubmit={(values) => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              dispatch(itemAddedToCart({ checkedBooks: values.checkedBooks }));
            }}
          >
            <Form>
              <Box className="Books-form">
                {books.map((book, index) => {
                  return (
                    <label key={index} htmlFor="checkedBooks">
                      <div className="book-label">
                        <Field
                          disabled={book.stopOrder}
                          type="checkbox"
                          name="checkedBooks"
                          value={JSON.stringify({ title: book.title, price: book.price, id: book._id })}
                        ></Field>
                        <Book stopOrder={book.stopOrder} title={book.title} author={book.author} price={book.price} image={book.image} />
                      </div>
                    </label>
                  );
                })}
              </Box>

              <Button variant="contained" disableElevation type="submit" className="add-to-cart-button">
                Add to cart
              </Button>
            </Form>
          </Formik>
        </Box>
      ) : (
        <Loader message={"No books in database.."} timeout={5000} />
      )}
      <Cart />
    </>
  );
}

export default User;
