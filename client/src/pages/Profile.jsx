import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserDetails from "../components/UserDetails";
import BooksAdded from "../components/BooksAdded";
import BooksReviewed from "../components/BooksReviewed";
import BooksPurchased from "../components/BooksPurchased";

const Profile = ({
  booksReviewed,
  booksAdded,
  getUsersRatings,
  booksAddedByUser,
  booksPurchased,
  isAdmin,
}) => {
  const { user } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  let profileContent = "";
  if (tab === "profile") {
    profileContent = <UserDetails user={user} />;
  }
  if (user && user.isAdmin && tab === "booksAdded") {
    profileContent = (
      <BooksAdded
        booksAdded={booksAdded}
        user={user}
        booksAddedByUser={booksAddedByUser}
      />
    );
  }
  if (user && !user.isAdmin && tab === "booksReviewed") {
    profileContent = (
      <BooksReviewed
        booksReviewed={booksReviewed}
        getUsersRatings={getUsersRatings}
      />
    );
  }
  if (user && !user.isAdmin && tab === "booksPurchased") {
    profileContent = (
      <BooksPurchased user={user} booksPurchased={booksPurchased} />
    );
  }

  useEffect(() => {
    setTab(isAdmin ? "booksAdded" : "booksReviewed");
  }, [isAdmin]);

  return (
    <div className="pb-4 pt-2 sm:pb-8 px-2 lg:px-4">
      <div className="pt-4 black-bg z-20 top-62px top-60px sticky md:flex block justify-between items-center pb-4">
        <h3 className="text-amber-300 font-bold text-2xl my-0">Your Profile</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mt-3 md:mt-0">
          {user && user.isAdmin && (
            <Link
              className={`p-0 hover:text-white ${
                tab == "booksAdded" ? "text-amber-300" : "text-slate-300"
              }`}
              onClick={() => setTab("booksAdded")}
            >
              {`Books Added${
                booksAdded && booksAdded.length > 0
                  ? `(${booksAdded.length})`
                  : ""
              }`}
            </Link>
          )}
          {user && !user.isAdmin && (
            <Link
              className={`p-0 hover:text-white ${
                tab == "booksReviewed" ? "text-amber-300" : "text-slate-300"
              }`}
              onClick={() => setTab("booksReviewed")}
            >
              {`Books Reviewed${
                booksReviewed && booksReviewed.length > 0
                  ? `(${booksReviewed.length})`
                  : ""
              }`}
            </Link>
          )}
          {user && !user.isAdmin && (
            <Link
              className={`p-0 hover:text-white ${
                tab == "booksPurchased" ? "text-amber-300" : "text-slate-300"
              }`}
              onClick={() => setTab("booksPurchased")}
            >
              Books Purchased
            </Link>
          )}
          <Link
            onClick={() => setTab("profile")}
            className={`p-0 hover:text-white ${
              tab == "profile" ? "text-amber-300" : "text-slate-300"
            }`}
          >
            Personal Details
          </Link>
          <Link
            to="/change-password"
            className="text-slate-300 hover:text-white"
          >
            Change Password
          </Link>
        </div>
      </div>

      <div className="mx-auto md:px-3">{profileContent}</div>
    </div>
  );
};

export default Profile;
