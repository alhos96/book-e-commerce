import "./checkout.css";
import React, { useState, useEffect } from "react";
import { Box, Typography, Fade, List, ListItem, Divider } from "@mui/material";
import { methods, getSomething } from "../../helpers";
import Loader from "../Loader";
import moment from "moment";

function Transactions() {
  //helpers
  const { get } = methods;
  const url = window.location.pathname;

  //local state
  const [fade, setFade] = useState(false);
  const [transactions, setTransactions] = useState([]);

  //side effects

  useEffect(() => {
    setFade(true);
    getSomething(get, `/orders${url}`, {}, false, setTransactions);

    return () => {
      setTransactions([]);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Fade in={fade} timeout={{ enter: 500 }}>
        <Box className="Transaction-wrapp">
          <Divider textAlign="left" className="main-divider">
            <Typography>Transactions</Typography>
          </Divider>
          {transactions.length > 0 ? (
            <List>
              {transactions.map((transaction, index) => {
                return (
                  <List key={index}>
                    <ListItem>
                      <span className="small-title">Costumer:</span> &nbsp; {transaction.costumer}
                    </ListItem>
                    <ListItem sx={{ mb: -2 }} className="small-title">
                      Cart Items:
                    </ListItem>

                    {transaction.cartItems.map((item, index) => {
                      return (
                        <List key={index} sx={{ mb: -2 }}>
                          <ListItem sx={{ mb: -2 }}>
                            <span className="smaller-title">Title:</span> &nbsp; {item.title}
                          </ListItem>
                          <ListItem>
                            <span className="smaller-title">Price:</span> &nbsp;{item.price}
                          </ListItem>
                        </List>
                      );
                    })}

                    <ListItem sx={{ mt: 2 }}>
                      <span className="small-title">Date: </span> &nbsp;
                      {moment(transaction.createdAt).format("DD.MM.YYYY.")}
                    </ListItem>
                    <Divider></Divider>
                  </List>
                );
              })}
            </List>
          ) : (
            <Loader message={"No transactions to show.."} timeout={5000} buttonText={"Go home"} path={"/"} />
          )}
        </Box>
      </Fade>
    </>
  );
}

export default Transactions;
