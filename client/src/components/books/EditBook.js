import "./books.css";
import React, { useState, useEffect } from "react";
import { Box, Button, Fade, IconButton, Typography, Divider } from "@mui/material";
import axios from "axios";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { getABook } from "../../store/ordersSlice";
import Delete from "@mui/icons-material/Delete";
import { getSomething, methods, blockInvalidChar } from "../../helpers";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import Loader from "../Loader";
import MyBackdrop from "../MyBackdrop";

function EditBook() {
  //helpers
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { get } = methods;
  const url = window.location.pathname;

  //global state
  const token = sessionStorage.getItem("token");

  //local state
  const [fade, setFade] = useState(false);
  const [file, setFile] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [message, setMessage] = useState("");
  const [book, setBook] = useState(false);

  //side effects
  useEffect(() => {
    setFade(true);
    getSomething(get, `/books${url}`, {}, false, setBook);
    dispatch(getABook(`/api/books${url}`, get));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    book && setFile(`http://localhost:5000/images/${book.image}`);
  }, [book]);

  return (
    <>
      <MyBackdrop showBackdrop={showBackdrop} message={message} />
      {book ? (
        <Fade in={fade} timeout={{ enter: 500 }}>
          <Box className="Edit-book">
            <Divider textAlign="left" className="main-divider">
              <Typography>Edit Book</Typography>
            </Divider>
            {file && <img id="uploaded-image" src={file} alt="uploaded"></img>}
            <IconButton
              size="large"
              id={book._id}
              onClick={() => {
                axios
                  .delete(`http://localhost:5000/api/books/${url}`)
                  .then((res) => {
                    setMessage("Book deleted successfully!");
                    setShowBackdrop(true);
                    setTimeout(() => {
                      navigate("/");
                    }, 2000);
                  })
                  .catch((err) => {
                    setMessage("Book delete was unsuccessful!");
                  });
              }}
            >
              <Delete />
            </IconButton>
            <Formik
              initialValues={{
                img: book.image,
                title: book.title,
                author: book.author,
                price: book.price,
                stock: book.stock,
                reorderNotification: [book.reorderNotification],
              }}
              onSubmit={(values) => {
                const newBook = new FormData();

                newBook.append("img", values.img);
                newBook.append("title", values.title);
                newBook.append("author", values.author);
                newBook.append("price", values.price);
                newBook.append("stock", values.stock);
                newBook.append("reorderNotification", values.reorderNotification);

                axios
                  .patch(`http://localhost:5000/api/books${url}`, newBook, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then((res) => {
                    setMessage("Book edited successfully!");
                    setShowBackdrop(true);
                    setTimeout(() => {
                      navigate("/");
                    }, 2000);
                  })
                  .catch((err) => {
                    setMessage("Book edite was unsuccessful!");
                  });
              }}
            >
              {({ values }) => (
                <Form encType="multipart/form-data">
                  <label className="upload-photo" htmlFor="img">
                    {!file && <CameraAltOutlinedIcon color="primary" className="camera-icon" />}
                    <Typography className="upload-photo-title" variant="body2" color="primary">
                      {!file ? "Upload Photo. Photo is required." : "Choose Different?"}
                    </Typography>

                    <input
                      style={{ display: "none" }}
                      onChange={(e) => {
                        setFile(URL.createObjectURL(e.target.files[0]));
                        values.img = e.target.files[0];
                      }}
                      id="img"
                      type="file"
                      name="img"
                    />
                  </label>
                  <br></br>

                  <label htmlFor="title">Title:</label>
                  <Field name="title" type="text" className="text-input" />

                  <label htmlFor="author">Author:</label>
                  <Field name="author" type="text" className="text-input" />

                  <label htmlFor="price">Price:</label>
                  <Field
                    name="price"
                    onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
                    type="number"
                    className="text-input"
                  />

                  <label htmlFor="stock">Stock:</label>
                  <Field onKeyDown={blockInvalidChar} name="stock" type="number" className="text-input" />

                  <label htmlFor="reorderNotification">Reorder Notification:</label>
                  <Field onKeyDown={blockInvalidChar} name="reorderNotification" type="number" className="text-input" />

                  <Typography>{message}</Typography>
                  <Button
                    variant="contained"
                    disableElevation
                    type="submit"
                    children="save"
                    fullWidth
                    className="button"
                    disabled={!file}
                  />

                  <Button
                    variant="contained"
                    color="secondary"
                    disableElevation
                    children="cancel"
                    fullWidth
                    className="button"
                    onClick={() => {
                      navigate("/");
                    }}
                  />
                </Form>
              )}
            </Formik>
          </Box>
        </Fade>
      ) : (
        <Loader message={"No books in database.."} timeout={5000} />
      )}
    </>
  );
}

export default EditBook;
