import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { toast } from "react-toastify";
import { removeRating } from "../apicalls/rating";

const SingleReviewedBook = ({
  ratingId,
  book,
  rating,
  title,
  review,
  willRecommend,
  time,
  getUsersRatings,
}) => {
  const dispatch = useDispatch();

  const removeMyRating = async (ratingId) => {
    try {
      dispatch(showLoading());
      const res = await removeRating({ ratingId: ratingId });
      if (res.success) {
        toast.success(res.message);
        getUsersRatings();
      } else {
        toast.error(res.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  return book == null ? (
    <div className="border border-slate-400 rounded p-4">
      <p className="text-sm leading-6 text-gray-400">
        <label className="text-white block">
          <span className="font-semibold">Review ID: {ratingId}</span>
        </label>
        <span>Reviewed on {moment(time).format("MMM Do YYYY")}</span>
        <br />
        <br />
        <span className="font-semibold text-lg">
          Sorry, this book has been deleted by Admin.
        </span>
        <button
          onClick={() => removeMyRating(ratingId)}
          className="py-2 border-amber-200 block mt-2 hover:bg-amber-300 hover:text-black outline-current"
        >
          Remove from Review
        </button>
      </p>
    </div>
  ) : (
    <li className="border p-3 rounded-md border-gray-500">
      <div className="gap-x-6 lg:flex relative">
        <Link to={`/book/${book._id}`}>
          <img src={book.thumbnail} alt="Book" width={150} />
        </Link>
        <div className="flex-1 mt-3 lg:mt-0">
          <h3 className="text-xl">
            <Link
              className="font-bold tracking-tight leading-7 leading-tight text-white hover:text-blue-400"
              to={`/book/${book._id}`}
            >
              {book.title}
            </Link>
          </h3>
          <p className="text-sm leading-6 text-gray-400">
            by <span className="font-semibold"> {book.author} </span>
          </p>
          <div className="w-full pt-2 flex justify-between mt-auto">
            <label className="text-white">
              <span className="font-semibold">Rs. {book.price.toFixed(2)}</span>
            </label>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {book.genre}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between align-center">
            <p className="text-white font-semibold">
              <span className="text-slate-300 font-normal">You rated:</span>{" "}
              {rating}
            </p>
            <p className="text-white font-semibold text-sm">
              <span className="text-slate-300 font-normal">Reviewed on </span>{" "}
              {moment(time).format("MMM Do YYYY")}
            </p>
          </div>
          <p className="text-white font-semibold">
            <span className="text-slate-300 font-normal">Title:</span> {title}
          </p>
          <p className="text-white font-semibold">
            <span className="text-slate-300 font-normal">Review:</span> {review}
          </p>
          <p className="text-white font-semibold">
            <span className="text-slate-300 font-normal">Will recommend?:</span>{" "}
            {willRecommend ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </li>
  );
};

export default SingleReviewedBook;
