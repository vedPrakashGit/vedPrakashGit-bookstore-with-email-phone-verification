import { useEffect, useState } from "react";
import Modal from "./Modal";
import RatingModal from "./RatingModal";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { getRatings } from "../apicalls/rating";
import moment from "moment";
import { AiFillLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

const Rating = ({ bookId, isReviewed, showReviewModal, getUsersRatings }) => {
  const [showRatingModel, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [overallRating, setOverallRating] = useState(null);
  const [recommends, setRecommends] = useState(null);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const ratingModelHandler = () => {
    setShowRatingModal(!showRatingModel);
  };
  const getRatingsData = async () => {
    try {
      dispatch(showLoading());
      const response = await getRatings({ bookId: bookId });
      if (response.success) {
        setRatings(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (showReviewModal) {
      setShowRatingModal(true);
    }
  }, [showReviewModal]);

  useEffect(() => {
    getRatingsData();
  }, []);

  useEffect(() => {
    if (ratings.length) {
      let rate = 0,
        recommend = 0;
      ratings.forEach((rating) => {
        rate += rating.rating;
        rating.willRecommend ? recommend++ : recommend;
      });
      setOverallRating((rate / ratings.length).toFixed(2));
      setRecommends(recommend);
    }
  }, [ratings]);

  return (
    <div>
      {showRatingModel && (
        <Modal showModalHandler={ratingModelHandler}>
          <RatingModal
            bookId={bookId}
            showModalHandler={ratingModelHandler}
            getRatingsData={getRatingsData}
            getUsersRatings={getUsersRatings}
            isReviewed={isReviewed}
          />
        </Modal>
      )}

      <div>
        <div className="md:flex justify-between items-center mt-5">
          <div>
            <h2 className="text-2xl font-semibold text-amber-200">
              Ratings & Reviews
            </h2>
            {overallRating && (
              <label className="yellow text-2xl flex items-center">
                &#9733;{" "}
                <span className="ml-1 text-lg text-white">
                  Overall Rating: {overallRating}
                </span>
              </label>
            )}
            {recommends && recommends > 0 ? (
              <label className="flex items-center text-white">
                <AiFillLike className="text-xl inline mr-2" /> {recommends} out
                of {ratings.length} reader(s) would like to recommend this book.
              </label>
            ) : (
              ""
            )}
          </div>
          {user && !user.isAdmin && (
            <div className="md:text-right mt-3 md:mt-0">
              <button
                onClick={ratingModelHandler}
                className={`bg-amber-200 text-black py-2 hover:bg-amber-300 active:bg-amber-400 focus:outline-none ${
                  isReviewed && "opacity-70 cursor-not-allowed"
                }`}
                disabled={isReviewed}
              >
                + Add Your Review
              </button>

              {isReviewed && (
                <p className="text-sm mt-2">
                  You've already reviewed this book!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {ratings && ratings.length == 0 && (
        <div className="p-6 my-8 border rounded text-center">
          <p className="text-xl text-white font-semibold">
            There are no ratings and reviews for this book.
            <br />
          </p>
          {user && !user.isAdmin && (
            <p className="text-md text-white pt-2">
              Click the "Add Your Review" button above to post your review for
              this book.
            </p>
          )}
        </div>
      )}

      {ratings && (
        <div className="ratings-wrapper pt-5">
          {ratings.map((rating) => {
            return (
              <div
                key={rating._id}
                className="py-6 md:p-6 text-center md:text-left space-y-4 bg-slate-900 rounded-md mb-4"
              >
                <div className="start-container inline-flex">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= rating.rating ? (
                      <div
                        key={`${rating._id}${star}`}
                        className="yellow text-2xl"
                      >
                        &#9733;
                      </div>
                    ) : (
                      <div
                        key={`${rating._id}${star}`}
                        className="text-gray-500 text-2xl"
                      >
                        &#9733;
                      </div>
                    )
                  )}
                </div>
                <blockquote className="mt-0-imp pt-0 text-white">
                  <h6 className="text-lg font-semibold mt-0 mb-2">
                    {rating.title}
                  </h6>
                  <p className="text-md">{`"${rating.review}"`}</p>
                </blockquote>
                <figcaption className="font-medium mt-0 md:mt-1">
                  <div className="text-slate-400 dark:text-slate-500">
                    Reviewed by{" "}
                    <span className="text-sky-500 dark:text-sky-400">
                      {rating?.user?.name ?? "[Deleted User]"}
                    </span>{" "}
                    on {moment(rating.createdAt).format("MMM Do YYYY")}
                  </div>
                </figcaption>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rating;
