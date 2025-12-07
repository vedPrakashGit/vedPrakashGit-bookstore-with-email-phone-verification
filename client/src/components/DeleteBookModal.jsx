import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { deleteBook } from "../apicalls/books";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const DeleteBookModal = ({
  getAllBooksOnLoad,
  showDeleteBookModalHandler,
  id,
  singleBook,
  booksAddedByUser,
  isDeletedFromProfile = null,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(booksAddedByUser);
  const deleteBookHandler = async () => {
    try {
      dispatch(showLoading());
      const res = await deleteBook({ bookId: id });
      if (res.success) {
        toast.success(res.message);
        if (singleBook) {
          navigate("/");
        } else {
          if (isDeletedFromProfile) {
            booksAddedByUser();
          } else {
            getAllBooksOnLoad();
          }
        }
        showDeleteBookModalHandler();
      } else {
        toast.error(res.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err.message);
    }
  };

  return (
    <div className="px-4">
      <div className="flex justify-end text-black">
        <AiOutlineClose
          className="cursor-pointer"
          onClick={showDeleteBookModalHandler}
        />
      </div>
      <h3 className="mt-8 text-black font-bold text-center text-xl">
        Are you sure you want to delete this book from the list?
      </h3>
      <p className="text-black text-sm text-center">
        This action can't be undone! You will have to add all the details again
        to add this book.
      </p>

      <div className="modal-footer block sm:flex gap-3 pt-2 mt-4">
        <button
          type="button"
          onClick={showDeleteBookModalHandler}
          className="py-2 w-full flex-1 border-gray-400 block mt-2 bg-transparent text-black hover:bg-gray-100 hover:text-black text-black"
        >
          Cancel
        </button>
        <button
          onClick={deleteBookHandler}
          className="py-2 w-full flex-1 border-amber-300 block mt-2 bg-amber-300 hover:bg-amber-400 hover:text-black text-black"
        >
          Delete Book
        </button>
      </div>
    </div>
  );
};

export default DeleteBookModal;
