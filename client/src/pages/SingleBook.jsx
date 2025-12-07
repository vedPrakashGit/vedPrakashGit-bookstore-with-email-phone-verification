import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { toast, ToastContainer } from "react-toastify";
import { getBookById } from "../apicalls/books";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../components/Modal";
import DeleteBookModal from "../components/DeleteBookModal";
import BookForm from "../components/BookForm";
import { TbBookOff } from "react-icons/tb";
import StripeCheckout from "react-stripe-checkout";
import { addToPurchase, makePayment } from "../apicalls/purchase";

const SingleBook = ({
  addToCart,
  cartItems,
  booksReviewed,
  getUsersRatings,
}) => {
  const params = useParams();
  const [book, setBook] = useState("");
  const { user } = useSelector((state) => state.user);
  const [cartQty, setCartQty] = useState([]);
  const [formType, setFormType] = useState("Add");
  const [isReviewed, setIsReviewed] = useState(false);
  const [showBookFormModal, setShowBookFormModal] = useState(false);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showAddBookModalHandler = () => {
    setFormType("Edit");
    setShowBookFormModal(!showBookFormModal);
  };

  const showDeleteBookModalHandler = () => {
    setShowDeleteBookModal(!showDeleteBookModal);
  };

  const getBookData = async () => {
    try {
      dispatch(showLoading());
      const response = await getBookById(params.id);
      if (response.success) {
        setBook(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
      return;
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  const addTransactionToPurchase = async (transactionId) => {
    try {
      dispatch(showLoading());
      const res = await addToPurchase({
        user: user._id,
        transactionId,
        amount: book.price,
        books: [[book, 1]],
      });
      if (res.success) {
        toast.success(res.message);
        navigate("/thank-you");
        location.reload();
      } else {
        toast.error(res.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(showLoading());
      const res = await makePayment(token, book.price * 100);
      if (res.success) {
        toast.success("You've successfully made the payment.");
        await addTransactionToPurchase(res.data);
      } else {
        toast.error(res.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getBookData();
    let cartItem =
      cartItems &&
      cartItems.filter((item) => item.book && item.book._id == params.id);
    // console.log(cartItems, cartItem);
    setCartQty(cartItem && cartItem.length > 0 ? cartItem[0].quantity : 0);
  }, []);

  useEffect(() => {
    let isThisBookReviewed = null;
    isThisBookReviewed = booksReviewed.filter((b) => {
      if (b.book && book) {
        return b.book._id === book._id;
      }
    });
    // console.log(booksReviewed, isThisBookReviewed);
    if (isThisBookReviewed && isThisBookReviewed.length) {
      setIsReviewed(true);
    } else {
      setIsReviewed(false);
    }
  }, [booksReviewed, book]);

  return (
    <div>
      <ToastContainer />
      {showBookFormModal && (
        <Modal showModalHandler={showAddBookModalHandler}>
          <BookForm
            formType={formType}
            selectedBook={book}
            getBookData={getBookData}
            showAddBookModalHandler={showAddBookModalHandler}
            singleBook={true}
          />
        </Modal>
      )}
      {showDeleteBookModal && (
        <Modal showModalHandler={showDeleteBookModalHandler}>
          <DeleteBookModal
            singleBook={true}
            showDeleteBookModalHandler={showDeleteBookModalHandler}
            id={book._id}
          />
        </Modal>
      )}
      {book && (
        <article className="block md:flex items-start md:space-x-6 md:p-10 mt-3">
          <div className="flex-shrink-0">
            <img
              src={book.thumbnail}
              alt="Book"
              width="250"
              className="flex-none rounded-md bg-slate-100"
            />
            {user && user.isAdmin && (
              <div>
                <button
                  onClick={() => {
                    showAddBookModalHandler();
                  }}
                  className="py-2 mt-3 w-full border-amber-200 block mt-2 bg-amber-300 hover:bg-amber-400 hover:text-black outline-current"
                >
                  Edit the book
                </button>
                <button
                  onClick={() => {
                    showDeleteBookModalHandler();
                  }}
                  className="mt-3 w-full py-2 border-red-600 bg-red-600 hover:bg-red-700 hover:border-red-700 text-white block mt-2 outline-current"
                >
                  Delete the book
                </button>
              </div>
            )}
            {user && !user.isAdmin && book.availability && (
              <div>
                {cartQty > 1 && (
                  <span className="mt-3 mx-auto text-center block rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {cartQty} quantity has been added to the cart!
                  </span>
                )}
                <button
                  onClick={() => {
                    addToCart(book._id, book.price);
                    setCartQty((prev) => prev + 1);
                  }}
                  className="py-2 mt-3 w-full border-gray-600 block mt-2 bg-black text-white hover:text-white outline-current"
                >
                  Add to Cart
                </button>
                <StripeCheckout
                  token={onToken}
                  amount={book.price}
                  billingAddress
                  stripeKey="pk_test_51NqI5xSGUfHxcIWSfnC9Dqiku8WFe44dhEA7OQPPzQmZicf0pXfFD6tPjC9o2li7WXbCMEtsq4JQZwFeywpT4QjQ00vCX3AgcP"
                >
                  <button className="bg-amber-300 mt-3 text-black w-full py-2 hover:bg-amber-300 active:bg-amber-400 focus:outline-none">
                    Purchase this book
                  </button>
                </StripeCheckout>
              </div>
            )}
          </div>
          <div className="min-w-0 mt-4 md:mt-0 relative flex-auto">
            <h2 className="font-semibold text-4xl text-white pr-20">
              {book.title}
            </h2>
            <dl className="mt-3 text-white flex flex-wrap text-sm leading-6 font-medium items-center">
              <div className="ml-2">
                <dt className="sr-only">Genre</dt>
                <dd className="px-4 py-1 ring-1 ring-slate-200 rounded">
                  {book.genre}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Author</dt>
                <dd className="flex items-center text-lg">
                  <svg
                    width="2"
                    height="2"
                    fill="currentColor"
                    className="mx-3 text-slate-300"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  by&nbsp;<span className="font-semibold">{book.author}</span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Price</dt>
                <dd className="flex items-center text-lg">
                  <svg
                    width="2"
                    height="2"
                    fill="currentColor"
                    className="mx-3 text-slate-300"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  Rs. {book.price.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="sr-only">Stock</dt>
                <dd className="flex items-center">
                  <svg
                    width="2"
                    height="2"
                    fill="currentColor"
                    className="mx-4 text-slate-300"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <div className="px-4 py-1 ring-1 bg-slate-700 rounded-2xl">
                    {book.availability ? "Available" : "Not in stock"}
                  </div>
                </dd>
              </div>
            </dl>

            <hr className="mt-4" />

            <Rating
              bookId={book._id}
              isReviewed={isReviewed}
              getUsersRatings={getUsersRatings}
              showReviewModal={params.query == "showReviewModal" ? true : false}
            />

            <Link
              to="/"
              className="py-2 px-6 flex-1 inline-flex items-center justify-center gap-2 border-2 text-amber-200 border-amber-200 mt-2 hover:bg-amber-200 hover:text-black rounded-lg mt-10"
            >
              <AiOutlineArrowLeft />
              Back
            </Link>
          </div>
        </article>
      )}

      {!book ? (
        <div className="max-w-2xl mx-auto p-6 my-8 border rounded text-center my-20 text-white">
          <TbBookOff className="text-amber-400 mx-auto mb-4 text-4xl" />
          <p className="text-xl font-semibold">
            Sorry ! This book does not exist.
            <br />
          </p>
          <p className="text-md pt-2">
            Go to{" "}
            <Link to="/" className="text-amber-400 hover:text-amber-300">
              Homepage
            </Link>{" "}
            and you may find other books over there.
          </p>
          <Link
            to="/"
            className="mt-4 py-2 inline-block px-6 py rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black outline-current"
          >
            Go to Homepage
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleBook;
