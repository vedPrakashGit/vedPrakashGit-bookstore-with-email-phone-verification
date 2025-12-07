import React, { useRef, useState } from "react";
import { addRating } from "../apicalls/rating";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

const RatingModal = ({
  bookId,
  showModalHandler,
  isReviewed,
  getRatingsData,
  getUsersRatings,
}) => {
  const { user } = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [recommend, setRecommend] = useState(true);
  const titleRef = useRef();
  const reviewRef = useRef();
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isReviewValid, setIsReviewValid] = useState(true);
  const dispatch = useDispatch();

  // When user is hovering over the stars
  const addColor = (e) => {
    const stars = document.querySelectorAll(".star");
    let num = +e.target.getAttribute("data-pos");
    stars.forEach((star, idx) => {
      star.classList.remove("yellow");
    });
    stars.forEach((star, idx) => {
      if (idx < num) {
        star.classList.add("yellow");
      }
    });
  };

  // When user has left the hovering from the stars
  const removeColor = () => {
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, idx) => {
      star.classList.remove("yellow");
    });
    stars.forEach((star, idx) => {
      if (idx < rating) {
        star.classList.add("yellow");
      }
    });
  };

  // When user clicks one of the stars
  const markRating = (e) => {
    let num = +e.target.getAttribute("data-pos");
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, idx) => {
      if (idx < num) {
        star.classList.add("yellow");
      } else {
        star.classList.remove("yellow");
      }
    });
    setRating(num);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let areAllFieldsGood = true;
      if (title == "" || title.trim().length == 0) {
        setIsTitleValid(false);
        areAllFieldsGood = false;
      }
      if (review == "" || review.trim().length == 0) {
        setIsReviewValid(false);
        areAllFieldsGood = false;
      }

      if (!areAllFieldsGood) {
        return;
      }

      const data = {
        rating: rating === 0 ? 1 : rating,
        title: titleRef.current.value,
        review: reviewRef.current.value,
        willRecommend: recommend,
        book: bookId,
        user: user._id,
      };

      const response = await addRating(JSON.stringify(data));
      dispatch(showLoading());
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err);
    }
    getRatingsData();
    getUsersRatings();
    showModalHandler();
  };

  return (
    <div className="modal-body">
      <div className="flex items-center justify-between border-b-2 border-gray-500 border-b-gray-500 mb-4">
        <h3 className="text-black text-2xl font-bold ">
          Share your Rating & Review
        </h3>
        <AiOutlineClose
          className="text-black cursor-pointer"
          onClick={showModalHandler}
        />
      </div>

      {isReviewed && (
        <div className="text-center pt-4 pb-8">
          <span className="text-4xl text-amber-500"> &#9733;</span>
          <h3 className="text-black text-xl font-bold ">
            You've already reviewed this book!
          </h3>
          <button
            type="button"
            onClick={showModalHandler}
            className="py-2 flex-1 border-gray-400 inline-block mt-4 bg-transparent text-black hover:bg-gray-100 hover:text-black outline-current"
          >
            Close this window
          </button>
          <div className="text-center pt-3">
            <Link to="/">Back to Homepage</Link>
          </div>
        </div>
      )}

      {isReviewed == false && (
        <form>
          <div className="mb-4">
            <label className="block">
              <div className="flex justify-between items-center">
                <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                  Mark your rating here
                </span>
                {rating > 0 && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    You rated {rating}.
                  </span>
                )}
              </div>
              <div
                className="star-container inline-flex mt-1"
                onMouseLeave={removeColor}
              >
                <div
                  onClick={markRating}
                  onMouseOver={addColor}
                  className="star cursor-pointer text-black text-2xl"
                  data-pos="1"
                >
                  &#9733;
                </div>
                <div
                  onClick={markRating}
                  onMouseOver={addColor}
                  className="star cursor-pointer text-black text-2xl"
                  data-pos="2"
                >
                  &#9733;
                </div>
                <div
                  onClick={markRating}
                  onMouseOver={addColor}
                  className="star cursor-pointer text-black text-2xl"
                  data-pos="3"
                >
                  &#9733;
                </div>
                <div
                  onClick={markRating}
                  onMouseOver={addColor}
                  className="star cursor-pointer text-black text-2xl"
                  data-pos="4"
                >
                  &#9733;
                </div>
                <div
                  onClick={markRating}
                  onMouseOver={addColor}
                  className="star cursor-pointer text-black text-2xl"
                  data-pos="5"
                >
                  &#9733;
                </div>
              </div>
            </label>
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="title">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Review Title
              </span>
              <input
                type="text"
                name="title"
                id="title"
                ref={titleRef}
                required={true}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Enter the review title"
              />
            </label>
            {!isTitleValid && !title.length && (
              <span className="text-sm text-red-500">Title is required!</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="review">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                Why do you like this book?
              </span>
              <textarea
                name="reivew"
                id="review"
                ref={reviewRef}
                required={true}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Type your review in a descriptive manner"
              />
            </label>
            {!isReviewValid && !review.length && (
              <span className="text-sm text-red-500">Review is required!</span>
            )}
          </div>
          <div className="mb-4">
            <label className="block mt-3">
              <span className="block text-sm font-medium text-slate-700">
                Would you like to recommend this book?
              </span>
              <div className="user-type flex border overflow-hidden rounded-md border-gray-300 mt-1">
                <div className="flex-1 text-center">
                  <input
                    type="radio"
                    name="recommend"
                    hidden
                    id="yes"
                    onClick={() => setRecommend(true)}
                  />
                  <label
                    htmlFor="yes"
                    className={`block py-2 text-black text-sm cursor-pointer ${
                      recommend === true ? "active" : ""
                    }`}
                  >
                    Yes
                  </label>
                </div>
                <div className="flex-1 text-center">
                  <input
                    type="radio"
                    name="recommend"
                    hidden
                    id="no"
                    onClick={() => setRecommend(false)}
                  />
                  <label
                    htmlFor="no"
                    className={`block py-2 text-black text-sm cursor-pointer ${
                      recommend === false ? "active" : ""
                    }`}
                  >
                    No
                  </label>
                </div>
              </div>
            </label>
          </div>
          <div className="modal-footer block sm:flex gap-3 pt-2 mt-4">
            <button
              type="button"
              onClick={showModalHandler}
              className="py-2 w-full flex-1 border-gray-400 block mt-2 bg-transparent text-black hover:bg-gray-100 hover:text-black text-black"
            >
              Cancel
            </button>
            <button
              onClick={formSubmitHandler}
              className="py-2 w-full flex-1 border-amber-200 block mt-2 bg-amber-300 hover:bg-amber-400 hover:text-black text-black"
            >
              Submit Your Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RatingModal;
