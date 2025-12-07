import "./App.css";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "./pages/ChangePassword";
import SingleBook from "./pages/SingleBook";
import Cart from "./pages/Cart";
import { useDispatch, useSelector } from "react-redux";
import { getCart, createCart, updateCart } from "./apicalls/cart";
import { toast } from "react-toastify";
import { showLoading, hideLoading } from "./redux/loaderSlice";
import { getRatingsByUser } from "./apicalls/rating";
import { getBooksAddedByUser } from "./apicalls/books";
import Loader from "./components/Loader";
import { getPurchasedBooks } from "./apicalls/purchase";
import ThankYou from "./pages/ThankYou";

function App() {
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.loader);
  const [cartItems, setCartItems] = useState([]);
  const [booksReviewed, setBooksReviewed] = useState([]);
  const [booksAdded, setBooksAdded] = useState([]);
  const [booksPurchased, setBooksPurchased] = useState([]);
  const dispatch = useDispatch();

  // Getting all the items of the cart added by the user
  const getCartItems = async () => {
    try {
      dispatch(showLoading());
      const response = await getCart({ userId: user._id });
      if (response.success) {
        let temp = response.data;
        temp.reverse();
        setCartItems(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  // This function will be invoked when the user will press the "Add to Cart" button
  const addToCart = async (bookId, price) => {
    try {
      dispatch(showLoading());
      let idExists = false;
      let response = null;
      let existingQuantity = 0;
      let cartId = null;

      cartItems.forEach((item) => {
        if (item.book._id == bookId) {
          cartId = item._id;
          idExists = true;
          existingQuantity = item.quantity;
        }
      });

      if (idExists) {
        response = await updateCart({
          cartId: cartId,
          book: bookId,
          user: user._id,
          quantity: existingQuantity + 1,
          amount: (existingQuantity + 1) * price,
        });
      } else {
        response = await createCart({
          book: bookId,
          user: user._id,
          amount: price,
        });
      }
      if (response.success) {
        toast.success(response.message);
        getCartItems();
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err);
    }
  };

  // Getting the books reviewed by the user
  const getUsersRatings = async () => {
    try {
      dispatch(showLoading());
      const res = await getRatingsByUser({ userId: user && user._id });
      if (res.success) {
        let temp = res.data;
        temp.reverse();
        setBooksReviewed(temp);
      } else {
        toast.error(res.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err);
    }
  };

  // Getting the books added by the user
  const booksAddedByUser = async () => {
    try {
      dispatch(showLoading());
      const res = await getBooksAddedByUser({ userId: user && user._id });
      if (res.success) {
        let temp = res.data;
        temp.reverse();
        setBooksAdded(temp);
      } else {
        toast.error(res.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err);
    }
  };

  const getPurchasedBookByUser = async () => {
    try {
      dispatch(showLoading());
      const res = await getPurchasedBooks({ userId: user._id });
      if (res.success) {
        let temp = res.data;
        temp.reverse();
        setBooksPurchased(temp);
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
    if (user) {
      getUsersRatings();
      booksAddedByUser();
      getPurchasedBookByUser();
    }
  }, [user]);

  useEffect(() => {
    // if (user && (cartItems && cartItems.length === 0)) {
    if (user) {
      getCartItems();
    }
  }, [user]);

  return (
    <div>
      {loading && <Loader />}
      <BrowserRouter>
        <Navbar user={user} cartItems={cartItems} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home
                  addToCart={addToCart}
                  booksAddedByUser={booksAddedByUser}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile
                  booksReviewed={booksReviewed}
                  booksAdded={booksAdded}
                  getUsersRatings={getUsersRatings}
                  booksAddedByUser={booksAddedByUser}
                  booksPurchased={booksPurchased}
                  isAdmin={user && user.isAdmin}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <SingleBook
                  addToCart={addToCart}
                  cartItems={cartItems}
                  getUsersRatings={getUsersRatings}
                  booksReviewed={booksReviewed}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id/:query"
            element={
              <ProtectedRoute>
                <SingleBook
                  addToCart={addToCart}
                  cartItems={cartItems}
                  booksReviewed={booksReviewed}
                  getUsersRatings={getUsersRatings}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart
                  cartItems={cartItems}
                  getCartItems={getCartItems}
                  booksReviewed={booksReviewed}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thank-you"
            element={
              <ProtectedRoute>
                <ThankYou />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
