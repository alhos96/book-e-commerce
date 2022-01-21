import "./books.css";
import { Box, Typography } from "@mui/material";
import outofstock from "../../assets/images/outofstock.svg";

function Book({ title, author, price, image, stopOrder }) {
  //image and author will be passed only in home component

  return (
    <Box className="Book">
      {image && <img className="book-image" src={`http://localhost:5000/images/${image}`} alt="book" />}

      {stopOrder && <img height="100px" style={{ position: "absolute" }} src={outofstock}></img>}

      <div className="details">
        <Typography>Title: {title}</Typography>
        {author && <Typography>Author: {author}</Typography>}
        <Typography>Price: ${price.toFixed(2)}</Typography>
      </div>
    </Box>
  );
}

export default Book;
