import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { removeCart, updateCart } from "../apicalls/cart";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const SingleCart = ({ id, book, userId, booksReviewed, getCartItems, qty }) => {
  const [quantity, setQuantity] = useState(qty);
  const dispatch = useDispatch();
  const [isReviewed, setIsReviewed] = useState(false);
  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity == 1) {
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  const removeFromCart = async (id) => {
    try {
      dispatch(showLoading());
      const response = await removeCart({ cartId: id });
      if (response.success) {
        toast.success(response.message);
        getCartItems();
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
    async function updateCartItemData() {
      try {
        dispatch(showLoading());
        const res = await updateCart({
          cartId: id,
          book: book && book._id,
          user: userId,
          quantity: quantity,
          amount: quantity * (book && book.price),
        });
        if (!res.success) {
          toast.error(res.message);
        }
        getCartItems();
        dispatch(hideLoading());
      } catch (err) {
        dispatch(hideLoading());
        toast.error(err.message);
      }
    }
    updateCartItemData();
  }, [quantity]);

  useEffect(() => {
    let isThisBookReviewed = null;
    isThisBookReviewed =
      booksReviewed &&
      booksReviewed.filter((b) => b.book && b.book._id === book && book._id);
    if (isThisBookReviewed && isThisBookReviewed.length) {
      setIsReviewed(true);
    } else {
      setIsReviewed(false);
    }
  }, [booksReviewed, book]);

  return book == null ? (
    <div className="border border-slate-400 rounded p-4">
      <p className="text-sm leading-6 text-gray-400">
        <label className="text-white block">
          <span className="font-semibold">Cart ID: {id}</span>
        </label>
        <span className="font-semibold">
          Sorry, this book has been deleted by Admin.
        </span>
        <button
          onClick={() => removeFromCart(id)}
          className="py-2 border-amber-200 block mt-2 hover:bg-amber-300 hover:text-black text-black"
        >
          Remove from Cart
        </button>
      </p>
    </div>
  ) : (
    <li className="border p-3 rounded-md border-gray-500">
      <div className="gap-x-6 block lg:flex relative">
        <Link className="block mb-2 md:mb-0" to={`/book/${book._id}`}>
          <img src={book.thumbnail} alt="Book" width={150} />
        </Link>
        <div className="flex-1">
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
          <div className="block md:flex justify-between">
            <div>
              <label className="text-white mb-1 block">Choose quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQty}
                  className="py-2 text-white border-gray-600 bg-gray-600 hover:border-gray-600"
                >
                  -
                </button>
                <input
                  className="p-1 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1 text-center text-md h-10 w-16"
                  value={quantity}
                  onChange={() => {}}
                />
                <button
                  onClick={increaseQty}
                  className="py-2 text-white border-gray-600 bg-gray-600 hover:border-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            {quantity > 1 && (
              <div className="my-3 md:my-0">
                <label className="text-white mb-1 block md:text-right border-b-2 pb-2 border-b-slate-600">
                  Subtotal
                </label>
                <h6 className="font-bold text-md pt-1 text-white">
                  Rs. {(book.price * quantity).toFixed(2)}
                </h6>
              </div>
            )}
          </div>

          <div className="block md:flex justify-between gap-3">
            {isReviewed ? (
              <button
                disabled="true"
                title="Give Review"
                className="py-2 block px-3 w-full rounded-lg border-0 border-slate-500 bg-slate-500 mt-2 text-white hover:bg-slate-500 text-black cursor-not-allowed"
              >
                Already Reviewed
              </button>
            ) : (
              <Link
                to={`/book/${book._id}/showReviewModal`}
                title="Give Review"
                className="py-2 whitespace-nowrap px-4 block text-center rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black text-black"
              >
                &#9733; Give Review
              </Link>
            )}
            <button
              onClick={() => removeFromCart(id)}
              className="py-2 border-amber-200 block mt-2 w-full bg-amber-300 hover:bg-amber-400 hover:text-black text-black"
            >
              Remove from Cart
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default SingleCart;
