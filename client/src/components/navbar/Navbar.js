import "./navbar.css";
import React, { useState, useEffect } from "react";
import { Box, Fade, Typography, Stack, Link, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Search from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "../../store/usersSlice";
import { methods } from "../../helpers";
import { getBooks, resetCart } from "../../store/ordersSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Logo from "../logo/Logo";
import jwt_decode from "jwt-decode";

function Navbar({ token }) {
  //helpers
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { post, get } = methods;

  //local state
  const [fade, setFade] = useState(false);
  const [decoded, setDecoded] = useState(false);

  //side effects
  useEffect(() => {
    setFade(true);
  }, []);

  useEffect(() => {
    token && setDecoded(jwt_decode(token));
  }, [token]);

  return (
    <>
      <Fade in={fade} timeout={{ enter: 500 }}>
        <div className="nav-wrapp">
          <Box className="Navbar">
            <Logo className={"navbar-logo"} />

            {token ? (
              <Stack spacing={2} direction="row">
                <Typography variant="body1"> {decoded.username}</Typography>
                <Link
                  onClick={() => {
                    dispatch(userLoggedOut());
                    dispatch(resetCart());
                    navigate("/");
                  }}
                  className="link"
                  variant="body1"
                >
                  Logout
                </Link>
              </Stack>
            ) : (
              <Stack spacing={2} direction="row">
                <Link
                  onClick={() => {
                    navigate("/register");
                  }}
                  className="link"
                  variant="body1"
                >
                  Register
                </Link>
                <Link
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="link"
                  variant="body1"
                >
                  Login
                </Link>
              </Stack>
            )}
          </Box>

          <Box className="Search-wrapp">
            <Formik
              initialValues={{ search: "" }}
              onSubmit={(values) => {
                navigate("/");

                setTimeout(() => {
                  dispatch(getBooks("/api/books/find", post, values));
                }, 200); //give time so data fetched in Homes useEffect dont overwrite search data
              }}
              validateOnChange
              validationSchema={yup.object({
                search: yup.string().matches(/^[aA-zZ\s]+$/, "Only letters are allowed for this field "),
              })}
            >
              {({ values }) => {
                return (
                  <Form className="search-form-container">
                    <Field
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && values.search.length === 1) {
                          dispatch(getBooks("/api/books", get));
                        }
                      }}
                      placeholder="Search"
                      name="search"
                      type="text"
                      className="text-input"
                      required
                    ></Field>
                    <ErrorMessage className="error" name="search" component="p" />
                    <IconButton type="submit" className="field-adornment-icon">
                      <Search />
                    </IconButton>
                  </Form>
                );
              }}
            </Formik>
            {token && decoded.role === "admin" && (
              <Box className="select">
                <select
                  placeholder="Manage Options"
                  onChange={(e) => {
                    navigate(`/${e.target.value}`);
                  }}
                  style={styles.selectField}
                >
                  <option value="" label="Manage System" />
                  <option value="add-book" label="Add Book" />
                  <option value="transactions" label="Transactions" />
                  <option value="add-promotion" label="Add Promotion" />
                </select>
              </Box>
            )}
          </Box>
        </div>
      </Fade>
    </>
  );
}

export default Navbar;

const styles = {
  selectField: {
    display: "block",
    width: "100%",
  },
};
