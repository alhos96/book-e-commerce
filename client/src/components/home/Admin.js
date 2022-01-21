import "./home.css";
import React, { useEffect } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { methods } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../../store/ordersSlice";
import Book from "../books/Book";
import Loader from "../Loader";

function Admin() {
  //helpers
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { get } = methods;

  //global state
  const books = useSelector((state) => state.orders.books);

  //side effects
  useEffect(() => {
    dispatch(getBooks("/api/books", get));
  }, []);

  return (
    <>
      {books.length > 0 ? (
        <Box className="Books-list">
          <Divider textAlign="left" className="main-divider">
            <Typography>Items</Typography>
          </Divider>
          <Box className="Books-form">
            {books.map((book) => {
              return (
                <div key={book._id} className="book-label">
                  <Button id={book._id} size="small" onClick={({ target }) => navigate(`/edit-book/${target.id}`)}>
                    Edit
                  </Button>
                  <Book title={book.title} author={book.author} price={book.price} image={book.image} />
                </div>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Loader message={"No books in database.."} timeout={5000} />
      )}
    </>
  );
}

export default Admin;
