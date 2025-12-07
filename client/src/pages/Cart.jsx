import SingleCart from "../components/SingleCart";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { toast } from "react-toastify";
import { addToPurchase, makePayment } from "../apicalls/purchase";
import StripeCheckout from "react-stripe-checkout";
import { emptyCart } from "../apicalls/cart";

const Cart = ({ cartItems, booksReviewed, getCartItems }) => {
  const { user } = useSelector((state) => state.user);
  const [totalQty, setTotalQty] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addTransactionToPurchase = async (transactionId) => {
    try {
      dispatch(showLoading());
      let allBooks = [];

      cartItems.map((item) => {
        allBooks.push([item.book, item.quantity]);
      });

      const res = await addToPurchase({
        user: user._id,
        transactionId,
        amount: totalPrice,
        books: allBooks,
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

  const checkout = async (token) => {
    try {
      dispatch(showLoading());
      console.log(+totalPrice.toFixed(2));
      const res = await makePayment(token, +totalPrice.toFixed(0) * 100);
      if (res.success) {
        toast.success("You've successfully made the payment.");
        await addTransactionToPurchase(res.data);
        await emptyCart({ userId: user._id });
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
    let tempPrice = 0;
    let tempQty = 0;
    cartItems.forEach((item) => {
      if (item.book) {
        tempPrice = tempPrice + item.quantity * item.book.price;
        tempQty = tempQty + item.quantity;
      }
    });
    setTotalPrice(tempPrice);
    setTotalQty(tempQty);
  }, [cartItems]);

  return (
    <div className="py-4 sm:py-8 px-2 lg:px-4">
      <div className="block sm:flex justify-between items-center">
        <h1 className="text-amber-300 font-bold text-2xl my-0">Your Shopping Cart</h1>

        {cartItems.length ? (
          <StripeCheckout
            token={checkout}
            amount={totalPrice && totalPrice.toFixed(2) * 100}
            billingAddress
            stripeKey="pk_test_51NqI5xSGUfHxcIWSfnC9Dqiku8WFe44dhEA7OQPPzQmZicf0pXfFD6tPjC9o2li7WXbCMEtsq4JQZwFeywpT4QjQ00vCX3AgcP"
          >
            <button className="bg-amber-200 text-black py-2 px-6 hover:bg-amber-300 active:bg-amber-400 flex items-center justify-center mt-3 sm:mt-0 w-full">
              Checkout <HiOutlineArrowRight className="ml-2 text-lg" />
            </button>
          </StripeCheckout>
        ) : (
          ""
        )}
      </div>
      {cartItems && cartItems.length == 0 && (
        <div className="px-4 py-6 md:p-6 my-8 border rounded text-center w-full w-3/5 mx-auto text-white">
          <p className="text-3xl font-semibold">
            There is no item to display in your cart!
            <br />
          </p>
          <p className="text-md pt-2">
            Add your favorite books to your cart now!
          </p>
          <Link
            className="py-3 inline-block px-4 md:px-8 mt-8 rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black outline-current"
            to="/"
          >
            Go Back to Homepage
          </Link>
        </div>
      )}
      <div className="mx-auto pt-4 grid max-w-7xl gap-x-8 gap-y-20  xl:grid-cols-4">
        <ul className="grid gap-x-8 gap-y-4 sm:gap-y-6 xl:grid-cols-2 sm:grid-cols-2 xl:col-span-4">
          {cartItems &&
            cartItems.map((item) => (
              <SingleCart
                key={item._id}
                id={item._id}
                userId={user && user._id}
                book={item.book}
                qty={item.quantity}
                getCartItems={getCartItems}
                booksReviewed={booksReviewed}
              />
            ))}
        </ul>
      </div>
      <div className="border border-t-2 border-t-gray-900 w-full mt-8"></div>
      <div className="block md:flex justify-between pt-3">
        <div className="mb-4 md:mb-0">
          <label className="text-white text-lg">Total Items</label>
          <p className="text-amber-300 text-2xl font-semibold">
            {cartItems.length}
          </p>
        </div>
        <div className="mb-4 md:mb-0">
          <label className="text-white text-lg">Total Quantity</label>
          <p className="text-amber-300 text-2xl font-semibold">{totalQty}</p>
        </div>
        <div className="mb-4 md:mb-0">
          <label className="text-white text-lg">Total Price</label>
          <p className="text-amber-300 text-2xl font-semibold">
            Rs. {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {cartItems.length && (
        <div className="flex justify-center w-full mt-10">
          <StripeCheckout
            token={checkout}
            amount={totalPrice && totalPrice.toFixed(2) * 100}
            billingAddress
            stripeKey="pk_test_51NqI5xSGUfHxcIWSfnC9Dqiku8WFe44dhEA7OQPPzQmZicf0pXfFD6tPjC9o2li7WXbCMEtsq4JQZwFeywpT4QjQ00vCX3AgcP"
          >
            <button
              onClick={checkout}
              className="px-10 py-3 bg-amber-200 hover:bg-amber-300 text-black text-lg flex items-center"
            >
              Checkout Now <HiOutlineArrowRight className="ml-2 text-lg" />
            </button>
          </StripeCheckout>
        </div>
      )}
    </div>
  );
};

export default Cart;
