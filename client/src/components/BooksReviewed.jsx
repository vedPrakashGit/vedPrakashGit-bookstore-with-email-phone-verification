import React from "react";
import { LuStarOff } from "react-icons/lu";
import { Link } from "react-router-dom";
import SingleReviewedBook from "./SingleReviewedBook";

const BooksReviewed = ({ booksReviewed, getUsersRatings }) => {
  return (
    <div className="mt-6">
      {booksReviewed && booksReviewed.length == 0 && (
        <div className="max-w-2xl mx-auto p-6 my-8 border rounded text-center text-white">
          <LuStarOff className="text-amber-400 mx-auto mb-4 text-4xl" />
          <p className="text-xl font-semibold">
            There are no rating and review available to display here!
            <br />
          </p>
          <p className="text-md pt-2">
            Go to{" "}
            <Link to="/" className="text-amber-400 hover:text-amber-300">
              Homepage
            </Link>{" "}
            and choose any book that you want to rate and review.
          </p>
          <Link
            to="/"
            className="mt-4 py-2 inline-block px-6 py rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black outline-current"
          >
            Go to Homepage
          </Link>
        </div>
      )}

      {booksReviewed.length > 0 ? (
        <h4 className="text-center text-2xl mb-4 font-bold text-white">
          List of books Reviewed by you
        </h4>
      ) : (
        ""
      )}

      <ul className="grid gap-x-8 gap-y-4 sm:gap-y-6 xl:grid-cols-2 sm:grid-cols-2 xl:col-span-4">
        {booksReviewed &&
          booksReviewed.map((review) => (
            <SingleReviewedBook
              key={review._id}
              ratingId={review._id}
              book={review.book}
              rating={review.rating}
              title={review.title}
              review={review.review}
              willRecommend={review.willRecommend}
              time={review.updatedAt}
              getUsersRatings={getUsersRatings}
            />
          ))}
      </ul>
    </div>
  );
};

export default BooksReviewed;
