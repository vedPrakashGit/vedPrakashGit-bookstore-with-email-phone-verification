import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import moment from "moment";

const SingleAddedBook = ({
  book,
  setSelectedBook,
  showDeleteBookModalHandler,
  showAddBookModalHandler,
  setTargetBook,
}) => {
  return (
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
          <div className="w-full flex gap-2 justify-between items-center">
            <button
              onClick={() => {
                showAddBookModalHandler();
                setSelectedBook(book);
              }}
              className="py-2 px-3 flex-1 flex items-center justify-center gap-2 border-amber-200 block mt-2 bg-amber-300 hover:bg-amber-400 hover:text-black outline-current"
            >
              <AiOutlineEdit />
              Edit
            </button>
            <button
              onClick={() => {
                showDeleteBookModalHandler();
                setTargetBook(book._id);
              }}
              className="py- px-3 flex-1 flex items-center justify-center gap-2 border-red-600 bg-red-600 hover:bg-red-700 hover:border-red-700 block text-white mt-2 outline-current"
            >
              <AiOutlineDelete />
              Delete
            </button>
          </div>
          {
            <div className="mt-3">
              <p className="text-white font-semibold text-sm">
                <span className="text-slate-300 font-normal">Added on </span>{" "}
                {moment(book.createdAt).format("MMM Do YYYY")}
              </p>
              <p className="text-white font-semibold text-sm">
                <span className="text-slate-300 font-normal">
                  Last updated on{" "}
                </span>{" "}
                {moment(book.updatedAt).format("MMM Do YYYY")}
              </p>
            </div>
          }
        </div>
      </div>
    </li>
  );
};

export default SingleAddedBook;
