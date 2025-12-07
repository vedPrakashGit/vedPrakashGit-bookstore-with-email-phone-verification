import React from "react";
import SinglePurchasedBook from "./SinglePurchasedBook";

const SinglePurchasedBookWrapper = ({ id, time, books }) => {
  return (
    <>
      {books.map((book, idx) => (
        <SinglePurchasedBook
          key={`book._id${idx}`}
          id={id}
          time={time}
          book={book}
        />
      ))}
    </>
  );
};

export default SinglePurchasedBookWrapper;
