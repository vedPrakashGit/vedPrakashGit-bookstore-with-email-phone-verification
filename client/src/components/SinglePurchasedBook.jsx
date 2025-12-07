import { Link } from "react-router-dom";
import moment from "moment";

const SinglePurchasedBook = ({ id, time, book }) => {
  let qty = book[1];

  return book && book.length == 0 ? (
    <div className="border border-slate-400 rounded p-4">
      <p className="text-sm leading-6 text-gray-400">
        <label className="text-white block">
          <span className="font-semibold">Review ID: Lorem Ipsum</span>
        </label>
        <span>Reviewed on {moment(time).format("MMM Do YYYY")}</span>
        <br />
        <br />
        <span className="font-semibold text-lg">
          Sorry, this book has been deleted by Admin.
        </span>
        <button className="py-2 border-amber-200 block mt-2 hover:bg-amber-300 hover:text-black outline-current">
          Remove from Review
        </button>
      </p>
    </div>
  ) : (
    <li className="border p-3 rounded-md border-gray-500">
      <div className="gap-x-6 lg:flex relative">
        <Link to={`/book/${book[0]._id}`}>
          <img src={book[0].thumbnail} alt="Book" width={150} />
        </Link>
        <div className="flex-1 mt-3 lg:mt-0">
          <h3 className="text-xl">
            <Link
              className="font-bold tracking-tight leading-7 leading-tight text-white hover:text-blue-400"
              to={`/book/${book[0]._id}`}
            >
              {book[0].title}
            </Link>
          </h3>
          <p className="text-sm leading-6 text-gray-400">
            by <span className="font-semibold"> {book[0].author} </span>
          </p>
          <div className="w-full pt-2 flex justify-between mt-auto">
            <label className="text-white">
              <span className="font-semibold">
                Rs. {book[0].price.toFixed(2)}
              </span>
            </label>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {book[0].genre}
            </span>
          </div>
          <hr className="my-2" />

          {qty > 1 && (
            <div className="flex justify-between align-center mb-1">
              <p className="text-white font-semibold">
                <span className="text-slate-300 font-normal">Quantity:</span>
                {qty}
              </p>
              <p className="text-white font-semibold text-sm">
                <span className="text-slate-300 font-normal">
                  Total Price:{" "}
                </span>
                {(book[0].price * qty).toFixed(2)}
              </p>
            </div>
          )}

          <p className="text-white font-semibold mb-1">
            <span className="text-slate-300 font-normal">Transaction ID: </span>
            {id}
          </p>

          <p className="text-white font-semibold text-sm">
            <span className="text-slate-300 font-normal">Purchased on </span>{" "}
            {moment(time).format("MMM Do YYYY")}
          </p>
        </div>
      </div>
    </li>
  );
};

export default SinglePurchasedBook;
