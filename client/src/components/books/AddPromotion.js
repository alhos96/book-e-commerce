import "./books.css";
import React, { useState, useEffect } from "react";
import { Box, Button, Fade, Typography, Divider } from "@mui/material";
import axios from "axios";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import * as yup from "yup";
import { blockInvalidChar } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import MyBackdrop from "../MyBackdrop";
import { DatePickerField } from "../DatePickerField";

function AddPromotion() {
  //helpers
  const navigate = useNavigate();
  const url = window.location.pathname;

  //local state
  const [fade, setFade] = useState(false);
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
            <Typography>Add Promotion</Typography>
          </Divider>

          <Formik
            initialValues={{
              percentageDiscount: "",
              expireAt: "",
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={yup.object({
              percentageDiscount: yup.string().required("You must add price!"),
              expireAt: yup.string().required("You must add date!"),
            })}
            onSubmit={(values) => {
              axios
                .post(`http://localhost:5000/api/orders${url}`, values)
                .then((response) => {
                  setMessage(response.data.data);
                  setShowBackdrop(true);
                  setTimeout(() => {
                    navigate("/");
                  }, 1500);
                })
                .catch((err) => {
                  setMessage("Failed to create promotion!");
                });
            }}
          >
            {({ values }) => (
              <Form>
                <label htmlFor="percentageDiscount">Percentage Discount:</label>
                <Field onKeyDown={blockInvalidChar} name="percentageDiscount" type="number" className="text-input" />
                <ErrorMessage className="error" name="percentageDiscount" component="p" />

                <label htmlFor="percentageDiscount">Expiration Date:</label>
                <div style={{ cursor: "pointer" }} className="pick-date-wrapp">
                  <CalendarTodayIcon className="field-adornment-icon calendar-icon" />
                  <DatePickerField name="expireAt" />
                </div>
                <ErrorMessage className="error" name="expireAt" component="p" />

                <Typography>{message}</Typography>
                <Button variant="contained" disableElevation type="submit" children="add promotion" fullWidth className="button" />

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

export default AddPromotion;
