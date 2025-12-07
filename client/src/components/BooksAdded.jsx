import React, { useState } from "react";
import { TbBookOff } from "react-icons/tb";
import { Link } from "react-router-dom";
import SingleAddedBook from "./SingleAddedBook";
import Modal from "../components/Modal";
import DeleteBookModal from "../components/DeleteBookModal";
import BookForm from "./BookForm";

const isDeletedFromProfile = true;
const isEditedFromProfile = true;
const formType = "Edit";

const BooksAdded = ({ booksAdded, user, booksAddedByUser }) => {
  const [showBookFormModal, setShowBookFormModal] = useState(false);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const [targetBook, setTargetBook] = useState();

  const showAddBookModalHandler = () => {
    // setFormType("Edit");
    setShowBookFormModal(!showBookFormModal);
  };

  const showDeleteBookModalHandler = () => {
    setShowDeleteBookModal(!showDeleteBookModal);
  };

  return (
    <div className="mt-6">
      {showBookFormModal && (
        <Modal showModalHandler={showAddBookModalHandler}>
          <BookForm
            userId={user && user._id}
            formType={formType}
            selectedBook={selectedBook}
            showAddBookModalHandler={showAddBookModalHandler}
            booksAddedByUser={booksAddedByUser}
            isEditedFromProfile={isEditedFromProfile}
          />
        </Modal>
      )}

      {showDeleteBookModal && (
        <Modal showModalHandler={showDeleteBookModalHandler}>
          <DeleteBookModal
            showDeleteBookModalHandler={showDeleteBookModalHandler}
            id={targetBook}
            isDeletedFromProfile={isDeletedFromProfile}
            booksAddedByUser={booksAddedByUser}
          />
        </Modal>
      )}

      {booksAdded && booksAdded.length == 0 && (
        <div className="max-w-2xl mx-auto p-6 my-8 border rounded text-center">
          <TbBookOff className="text-amber-400 mx-auto mb-4 text-4xl" />
          <p className="text-xl font-semibold">
            You have not added any book yet!
            <br />
          </p>
          <p className="text-md pt-2">
            Go to{" "}
            <Link to="/" className="text-amber-400 hover:text-amber-300">
              Homepage
            </Link>{" "}
            and start adding the books for the people.
          </p>
          <Link
            to="/"
            className="mt-4 py-2 inline-block px-6 py rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black outline-current"
          >
            Go to Homepage
          </Link>
        </div>
      )}

      {booksAdded.length > 0 ? (
        <h4 className="text-center text-2xl mb-4 font-bold text-white">
          Books added by you
        </h4>
      ) : (
        ""
      )}

      <ul className="grid gap-x-8 gap-y-4 sm:gap-y-6 xl:grid-cols-2 sm:grid-cols-2 xl:col-span-4">
        {booksAdded &&
          booksAdded.map((book) => (
            <SingleAddedBook
              key={book._id}
              id={book._id}
              book={book}
              setSelectedBook={setSelectedBook}
              showAddBookModalHandler={showAddBookModalHandler}
              showDeleteBookModalHandler={showDeleteBookModalHandler}
              setTargetBook={setTargetBook}
            />
          ))}
      </ul>
    </div>
  );
};

export default BooksAdded;
