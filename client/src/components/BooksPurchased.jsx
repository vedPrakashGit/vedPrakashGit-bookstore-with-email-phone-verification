import { HiOutlineBookmarkSlash } from "react-icons/hi2";
import { Link } from "react-router-dom";
import SinglePurchasedBookWrapper from "./SinglePurchasedBookWrapper";

const BooksPurchased = ({ booksPurchased }) => {
  return (
    <div className="mt-6">
      {booksPurchased.length == 0 && (
        <div className="max-w-2xl mx-auto p-6 my-8 border rounded text-center text-white">
          <HiOutlineBookmarkSlash className="text-amber-400 mx-auto mb-4 text-4xl" />
          <p className="text-xl font-semibold">
            You have not purchased any book yet!
            <br />
          </p>
          <p className="text-md pt-2">
            Go to &nbsp;
            <Link to="/" className="text-amber-400 hover:text-amber-300">
              Homepage &nbsp;
            </Link>
            and choose books that you want to purchase.
          </p>
          <Link
            to="/"
            className="mt-4 py-2 inline-block px-6 py rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black outline-current"
          >
            Go to Homepage
          </Link>
        </div>
      )}

      {booksPurchased.length > 0 ? (
        <h4 className="text-center text-2xl mb-4 font-bold text-white">
          List of books Purchased by you
        </h4>
      ) : (
        ""
      )}
      <ul className="grid gap-x-8 gap-y-4 sm:gap-y-6 xl:grid-cols-2 sm:grid-cols-2 xl:col-span-4">
        {booksPurchased.map((transaction) => (
          <SinglePurchasedBookWrapper
            key={transaction._id}
            id={transaction.transactionId}
            time={transaction.createdAt}
            books={transaction.books}
          />
        ))}
      </ul>
    </div>
  );
};

export default BooksPurchased;
