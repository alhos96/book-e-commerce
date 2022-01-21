import { createSlice } from "@reduxjs/toolkit";
import { apiRequestStarted } from "./actions";

const slice = createSlice({
  name: "orders",

  initialState: {
    cartItems: [],
    books: [],
    book: [],
  },
  reducers: {
    itemAddedToCart: (orders, { payload }) => {
      orders.cartItems = payload.checkedBooks;
    },
    booksRecieved: (orders, { payload }) => {
      orders.books = payload.data;
    },
    aBookRecieved: (orders, { payload }) => {
      orders.book = payload.data;
    },

    //Resets all error messages left behind. Dispatch on onmount.
    messageReset: (orders, { payload }) => {
      orders.message = "";
      orders.error = "";
    },

    gotError: (orders, { payload }) => {
      console.log(payload);
      orders.error = payload;
    },

    resetABook: (orders, { payload }) => {
      orders.book = [];
    },
    resetCart: (orders, { payload }) => {
      orders.cartItems = [];
    },
  },
});

export const getBooks = (url, method, data) => (dispatch, getState) => {
  dispatch(
    apiRequestStarted({
      url,
      method,
      data,
      onSuccess: booksRecieved.type,
      onError: gotError.type,
    })
  );
};

export const getABook = (url, method, data) => (dispatch, getState) => {
  dispatch(
    apiRequestStarted({
      url,
      method,
      data,
      onSuccess: aBookRecieved.type,
      onError: gotError.type,
    })
  );
};

export const { itemAddedToCart, booksRecieved, resetABook, resetCart, aBookRecieved, gotError } = slice.actions;
export default slice.reducer;
