import "./books.css";
import React, { useState, useEffect } from "react";
import { Box, Button, Fade, Typography, Divider } from "@mui/material";
import axios from "axios";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import * as yup from "yup";
import { blockInvalidChar } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import MyBackdrop from "../MyBackdrop";

function AddBook() {
  //helpers
  const navigate = useNavigate();
  const url = window.location.pathname;

  //global state
  const token = sessionStorage.getItem("token");

  //local state
  const [fade, setFade] = useState(false);
  const [file, setFile] = useState("");
  const [message, setMessage] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);

  //side effects
  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <>
      <MyBackdrop showBackdrop={showBackdrop} message={message} />
      <Fade in={fade} timeout={{ enter: 1000 }}>
        <Box className="Add-book">
          <Divider textAlign="left" className="main-divider">
            <Typography>Add Book</Typography>
          </Divider>

          {file && <img id="uploaded-image" src={file} alt="uploaded"></img>}

          <Formik
            initialValues={{
              img: "",
              title: "",
              author: "",
              price: "",
              stock: "",
              reorderNotification: "",
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={yup.object({
              img: yup.string().required("Image is required!"),
              title: yup.string().required("title is required!"),
              author: yup.string().required("Book must have author!"),
              price: yup.string().required("You must add price!"),
              stock: yup.string().required("You must add amount in stock!"),
              reorderNotification: yup.string().required("You must add reorder treshold!"),
            })}
            onSubmit={(values) => {
              const newBook = new FormData();

              newBook.append("img", values.img);
              newBook.append("title", values.title);
              newBook.append("author", values.author);
              newBook.append("price", values.price);
              newBook.append("stock", values.stock);
              newBook.append("reorderNotification", values.reorderNotification);

              axios
                .post(`http://localhost:5000/api/books${url}`, newBook, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                  setMessage("Book created successfully!");
                  setShowBackdrop(true);
                  setTimeout(() => {
                    navigate("/");
                  }, 3000);
                })
                .catch((err) => {
                  setMessage("Book creation unsuccessful!");
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
                <ErrorMessage className="error" name="title" component="p" />

                <label htmlFor="author">Author:</label>
                <Field name="author" type="text" className="text-input" />
                <ErrorMessage className="error" name="author" component="p" />

                <label htmlFor="price">Price:</label>
                <Field
                  onKeyDown={(e) => ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()}
                  name="price"
                  type="number"
                  className="text-input"
                />
                <ErrorMessage className="error" name="price" component="p" />

                <label htmlFor="stock">Stock:</label>
                <Field onKeyDown={blockInvalidChar} name="stock" type="number" className="text-input" />
                <ErrorMessage className="error" name="stock" component="p" />

                <label htmlFor="reorderNotification">Reorder Notification:</label>
                <Field onKeyDown={blockInvalidChar} name="reorderNotification" type="number" className="text-input" />
                <ErrorMessage className="error" name="reorderNotification" component="p" />

                <Typography>{message}</Typography>
                <Button variant="contained" disableElevation type="submit" children="save" fullWidth className="button" disabled={!file} />

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
    </>
  );
}

export default AddBook;
