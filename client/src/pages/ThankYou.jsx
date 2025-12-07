import React from "react";
import { PiCheckFatDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 my-16 border rounded text-center text-white">
      <PiCheckFatDuotone className="text-amber-400 mx-auto mb-4 text-6xl" />
      <p className="text-4xl font-semibold">
        Thank you!
        <br />
      </p>
      <p className="mt-3 text-xl font-semibold">
        Congratulations! You have successfully made the payment.
        <br />
      </p>
      <p className="text-md pt-2">
        You can see your purchased books in your profile under the{" "}
        <u>Books Purchased</u> tab. Click{" "}
        <Link to="/profile" className="text-amber-400 hover:text-amber-300">
          here{" "}
        </Link>
        to go to your profile page.
        <br />
        <div className="pt-3">or</div>
      </p>
      <Link
        to="/"
        className="mt-4 mb-6 py-2 inline-block px-6 py rounded-lg border border-amber-200 text-white hover:bg-amber-300 hover:text-black outline-current"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ThankYou;
