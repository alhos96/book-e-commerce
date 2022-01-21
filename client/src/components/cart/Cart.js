import "./cart.css";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Fade, Badge, Popover } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Cart() {
  //helpers
  const navigate = useNavigate();

  //global state
  const cartItems = useSelector((state) => state.orders.cartItems);

  //local state
  const [fade, setFade] = useState(false);
  const [price, setPrice] = useState(0);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setScreenSize(window.innerWidth);
  });

  //popover controls
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //side effects
  useEffect(() => {
    setFade(true);

    return () => {
      setPrice(0);
    };
  }, []);

  useEffect(() => {
    let price = cartItems.reduce((a, b) => a + JSON.parse(b).price, 0);
    setPrice(price);
  }, [cartItems]);

  return (
    <>
      <Fade in={fade} timeout={{ enter: 500 }}>
        <Box className="Cart-wrapp">
          {screenSize < 760 ? (
            <Badge className="cart-icon" badgeContent={cartItems.length} color="primary">
              <ShoppingCartIcon aria-describedby={id} color="action" onClick={handleClick} />
            </Badge>
          ) : (
            <Box className="cart">
              <Typography>Items: {cartItems.length}</Typography>
              <Typography>Price: {price.toFixed(2)}</Typography>
              <Button
                variant="contained"
                disabled={cartItems.length === 0}
                size="small"
                onClick={() => {
                  navigate("/checkout");
                }}
              >
                View Cart
              </Button>
            </Box>
          )}
        </Box>
      </Fade>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box className="cart" style={{ padding: "10px" }}>
          <Typography>Items: {cartItems.length}</Typography>
          <Typography>Price: {price.toFixed(2)}</Typography>
          <Button
            variant="contained"
            disabled={cartItems.length < 0}
            size="small"
            onClick={() => {
              navigate("/checkout");
            }}
          >
            View Cart
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default Cart;
