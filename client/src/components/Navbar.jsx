import React from "react";
import { Link } from "react-router-dom";
import { ImBook } from "react-icons/im";
import {
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineShoppingCart,
} from "react-icons/ai";

const Navbar = ({ user, cartItems }) => {
  // console.log(cartItems);
  return (
    <div className="container max-w-screen-xl px-3 sticky top-0 black-bg z-10 ">
      <nav
        className={`flex items-center py-2 border-b-2 border-gray-500 border-b-gray-500 ${
          user && !user.isAdmin ? "flex-col sm:flex-row" : ""
        }`}
      >
        <h2>
          <Link
            className="logo font-bold text-xl text-3xl text-white hover:text-yellow-300 flex items-center"
            to="/"
          >
            <ImBook className="text-2xl mr-2" />
            BookStore
          </Link>
        </h2>
        <ul
          className={`flex justify-end items-center w-full gap-x-8 ${
            user && !user.isAdmin ? "justify-center sm:justify-end" : ""
          }`}
        >
          <li>
            <Link
              className="text-white hover:text-yellow-300"
              to="/"
              title="Home"
            >
              Home
            </Link>
          </li>
          {user && !user.isAdmin && (
            <li>
              <Link
                className="text-white hover:text-yellow-300 flex items-center"
                to="/cart"
                title="Cart"
              >
                <AiOutlineShoppingCart className="mr-2" /> Cart(
                {cartItems.length})
              </Link>
            </li>
          )}
          {user && (
            <li className="flex items-center">
              <Link
                className="text-white hover:text-yellow-300 flex items-center"
                to="/profile"
                title="Profile"
              >
                <AiOutlineUser className="inline-block mr-1" />{" "}
                {user.name.split(" ")[0]}
              </Link>
              <Link
                className="text-white ml-3 text-xl hover:text-yellow-300"
                title="Logout"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                <AiOutlineLogout />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
