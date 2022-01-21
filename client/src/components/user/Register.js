import "./user.css";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Divider, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { methods, blockInvalidChar } from "../../helpers";
import { userRegister, messageReset } from "../../store/usersSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import MyBackdrop from "../MyBackdrop";
import * as yup from "yup";

function Register() {
  //helpers
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { post } = methods;

  //global state
  const error = useSelector((state) => state.users.error);
  const isRegistered = useSelector((state) => state.users.registered);

  //local state
  const [fade, setFade] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  //side effects
  useEffect(() => {
    if (isRegistered) {
      setShowBackdrop(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }

    return () => {
      clearTimeout();
      dispatch(messageReset());
    };
    // eslint-disable-next-line
  }, [isRegistered]);

  useEffect(() => {
    setFade(true);
  }, []);

  return (
    <>
      <MyBackdrop showBackdrop={showBackdrop} />

      <Fade in={fade} timeout={{ enter: 500 }} mountOnEnter unmountOnExit>
        <Box className="Register">
          <Divider className="main-divider" textAlign="left">
            <Typography variant="body1">Register</Typography>
          </Divider>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              passwordConfirmation: "",
              address: "",
              state: "",
              city: "",
              zipcode: "",
              member: false,
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={yup.object({
              username: yup.string().required("Name is required"),
              email: yup.string().email("Enter valid email").required("Email is requiered"),
              password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password is required"),
              passwordConfirmation: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
              address: yup.string().required("Address is requiered"),
              state: yup.string().required("State is requiered"),
              city: yup.string().required("City is requiered"),
              zipcode: yup.string().required("Zipcode is requiered"),
            })}
            onSubmit={(values) => {
              dispatch(userRegister("/users/register", values, post));
            }}
          >
            {() => (
              <Form className="login-form">
                <label className="label" htmlFor="username">
                  Userame:
                </label>
                <Field name="username" type="text" className="text-input" />
                <ErrorMessage className="error" name="username" component="p" />

                <label className="label" htmlFor="email">
                  Email:
                </label>
                <Field name="email" type="text" className="text-input" />
                <ErrorMessage className="error" name="email" component="p" />

                <label htmlFor="password">Password:</label>
                <Field name="password" type="password" className="text-input" />
                <ErrorMessage className="error" name="password" component="p" />

                <label htmlFor="passwordConfirmation">Re-type Password:</label>
                <Field name="passwordConfirmation" type="password" className="text-input" />
                <ErrorMessage className="error" name="passwordConfirmation" component="p" />

                <label className="label" htmlFor="address">
                  Address:
                </label>
                <Field name="address" type="text" className="text-input" />
                <ErrorMessage className="error" name="address" component="p" />

                <label className="label" htmlFor="state">
                  State:
                </label>
                <Field name="state" type="text" className="text-input" />
                <ErrorMessage className="error" name="state" component="p" />

                <label className="label" htmlFor="city">
                  City:
                </label>
                <Field name="city" type="text" className="text-input" />
                <ErrorMessage className="error" name="city" component="p" />

                <label className="label" htmlFor="zipcode">
                  Zip Code:
                </label>
                <Field name="zipcode" onKeyDown={blockInvalidChar} type="number" className="text-input" />
                <ErrorMessage className="error" name="zipcode" component="p" />

                <label htmlFor="member">
                  <Field type="checkbox" name="member" />I would like to become a member
                </label>

                <Typography>{error}</Typography>

                <Button className="button" children="register" type="submit" size="small" variant="contained" fullWidth disableElevation />
              </Form>
            )}
          </Formik>

          <Typography
            className="no-account-link"
            onClick={() => {
              navigate("/login");
              dispatch(messageReset());
            }}
            align="center"
            variant="body2"
          >
            Already have account? <span className="link">Login!</span>
          </Typography>
        </Box>
      </Fade>
    </>
  );
}

export default Register;
