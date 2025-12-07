import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
import { toast } from "react-toastify";
import { getAllBooks } from "../apicalls/books";
import BookForm from "../components/BookForm";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import DeleteBookModal from "../components/DeleteBookModal";
import { Link } from "react-router-dom";
import { LiaBookReaderSolid } from "react-icons/lia";

const genres = [
  "Fiction",
  "Historical Fiction",
  "Science Fiction",
  "Mystery",
  "Fantasy",
  "Thriller",
  "Poetry",
  "Graphic Novel",
  "Horror",
  "Literary Fiction",
  "Horror Fiction",
  "Memoir",
  "Adventure Fiction",
  "Children Literature",
  "Science Fantasy",
  "Dystopia",
  "Western Fiction",
  "Paranormal Romance",
  "Gothic Fiction",
  "True Crime",
  "Narrative Non-Fiction",
  "Bildungsroman",
  "Action Fiction",
  "Folklore",
  "Biography",
  "Story",
  "Moral",
];

const Home = ({ addToCart, booksAddedByUser }) => {
  const [bookData, setBookData] = useState([]);
  const [originalBookData, setOriginalBookData] = useState([]);
  const [formType, setFormType] = useState("Add");
  const [genre, setGenre] = useState("All Genre");
  const [searchText, setSearchText] = useState("");
  const [targetBook, setTargetBook] = useState();
  const [showBookFormModal, setShowBookFormModal] = useState(false);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [selectedBook, setSelectedBook] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterType, setFilterType] = useState("");
  const dispatch = useDispatch();

  const showAddBookModalHandler = () => {
    setFormType("Add");
    setShowBookFormModal(!showBookFormModal);
  };

  const dropdownHandler = () => {
    setShowDropdown(!showDropdown);
  };

  const showEditBookModalHandler = () => {
    setFormType("Edit");
    setShowBookFormModal(!showBookFormModal);
  };

  const showDeleteBookModalHandler = () => {
    setShowDeleteBookModal(!showDeleteBookModal);
  };

  const handleSearch = (e) => {
    e.persist();
    setSearchText(e.target.value);
  };

  const getAllBooksOnLoad = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllBooks();
      if (response.success) {
        dispatch(hideLoading());
        setBookData(response.data);
        setOriginalBookData([...response.data]);
      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err);
    }
  };

  document.addEventListener("mouseup", (e) => {
    e.stopPropagation();
    if (showDropdown && !e.target.classList.contains("dropdown-menu")) {
      setShowDropdown(false);
    }
  });

  const filterHandler = (type) => {
    setFilterType(type);
  };

  useEffect(() => {
    switch (filterType) {
      case "asc":
        const sortedListAsc =
          bookData.length && bookData.sort((a, b) => a.price - b.price);
        if (sortedListAsc.length) {
          setBookData([...sortedListAsc]);
        }
        break;
      case "desc":
        const sortedListDesc =
          bookData.length && bookData.sort((a, b) => b.price - a.price);
        if (sortedListDesc.length) {
          setBookData([...sortedListDesc]);
        }
        break;
      case "available":
        const availableBooks =
          bookData.length &&
          bookData.filter((book) => book.availability === true);
        if (availableBooks.length) {
          setBookData([...availableBooks]);
        }
        break;
      case "notavailable":
        const booksNotInStock =
          bookData.length &&
          bookData.filter((book) => book.availability === false);
        if (booksNotInStock.length) {
          setBookData([...booksNotInStock]);
        }
        break;
      case "":
        clearFilters();
        break;
      default:
        return;
    }
  }, [filterType]);

  const clearFilters = () => {
    setFilterType("");
    setBookData([...originalBookData]);
  };

  useEffect(() => {
    getAllBooksOnLoad();
  }, []);

  return (
    <div className="pb-4 pt-2 sm:pb-8 px-2 lg:px-4">
      {showBookFormModal && (
        <Modal showModalHandler={showAddBookModalHandler}>
          <BookForm
            userId={user && user._id}
            formType={formType}
            selectedBook={selectedBook}
            getAllBooksOnLoad={getAllBooksOnLoad}
            showAddBookModalHandler={showAddBookModalHandler}
            booksAddedByUser={booksAddedByUser}
          />
        </Modal>
      )}
      {showDeleteBookModal && (
        <Modal showModalHandler={showDeleteBookModalHandler}>
          <DeleteBookModal
            getAllBooksOnLoad={getAllBooksOnLoad}
            showDeleteBookModalHandler={showDeleteBookModalHandler}
            id={targetBook}
            booksAddedByUser={booksAddedByUser}
          />
        </Modal>
      )}
      <div className="pt-4 black-bg z-20 top-62px top-60px sticky block lg:flex justify-between items-center pb-4">
        <h1 className="text-amber-300 font-bold text-2xl my-0 leading-none mb-3 lg:mb-0">
          {user && user.isAdmin
            ? "List of books added"
            : "Our latest collection of books"}
        </h1>
        <div className="block md:flex">
          {bookData.length ? (
            <input
              onChange={(e) => handleSearch(e)}
              className="px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md focus:ring-1 text-md w-full md:w-80"
              placeholder="Search by book title or author"
            />
          ) : (
            ""
          )}
          <div className="flex mt-3 md:mt-0">
            <select
              id="genre"
              required={true}
              onChange={(e) => setGenre(e.target.value)}
              value={genre}
              className="md:ml-3 px-3 py-2 bg-white md:w-48 text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-md focus:ring-1"
            >
              <option key="0" value="All Genre">
                All Genres
              </option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className="ml-3 relative inline-block text-left w-48 text-md">
              <div className="h-full">
                <button
                  type="button"
                  onClick={dropdownHandler}
                  className="inline-flex h-full w-full justify-between items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-md text-black shadow-sm hover:bg-gray-50 whitespace-nowrap"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  Filter by
                  <svg
                    className="-mr-1 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div
                className={`dropdown-menu absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                  showDropdown ? "block" : "hidden"
                }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  <label
                    className={`text-black hover:text-amber-900 block px-4 py-2 text-md cursor-pointer ${
                      filterType == "asc" ? "active" : ""
                    }`}
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-0"
                    onClick={() => filterHandler("asc")}
                  >
                    Price - Ascending
                  </label>
                  <label
                    href="#"
                    className={`text-black hover:text-amber-900 block px-4 py-2 text-md cursor-pointer  ${
                      filterType == "desc" ? "active" : ""
                    }`}
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-1"
                    onClick={() => filterHandler("desc")}
                  >
                    Price - Descending
                  </label>
                  <label
                    href="#"
                    className={`text-black hover:text-amber-900 block px-4 py-2 text-md cursor-pointer  ${
                      filterType == "available" ? "active" : ""
                    }`}
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-2"
                    onClick={() => filterHandler("available")}
                  >
                    In Stock
                  </label>
                  <label
                    href="#"
                    className={`text-black hover:text-amber-900 block px-4 py-2 text-md cursor-pointer  ${
                      filterType == "notavailable" ? "active" : ""
                    }`}
                    role="menuitem"
                    tabIndex="-1"
                    id="menu-item-2"
                    onClick={() => filterHandler("notavailable")}
                  >
                    Not in Stock
                  </label>
                  <div className="mx-3 py-2">
                    <button
                      onClick={clearFilters}
                      className="btn w-full bg-black text-white hover:bg-amber-300 hover:text-black"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {user && user.isAdmin && (
              <button
                onClick={showAddBookModalHandler}
                className="ml-3 bg-amber-200 flex-shrink-0 text-black py-2 px-3 hover:bg-amber-300 active:bg-amber-400 focus:outline-none"
              >
                + <span className="hidden sm:inline">Add Book</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {bookData.length == 0 && (
        <div className="px-6 pt-8 pb-12 max-w-4xl mx-auto my-8 border rounded text-center text-white">
          <LiaBookReaderSolid className="text-8xl mx-auto" />
          <p className="text-3xl font-semibold">
            Currently, there is no book to display here.
            <br />
          </p>
          {user && user.isAdmin ? (
            <p className="text-md pt-2">
              Click the "Add Book" button above to start adding the books.
            </p>
          ) : (
            <p className="text-md pt-2">
              Please come back and try checking again, thanks!
            </p>
          )}
        </div>
      )}
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20  xl:grid-cols-4">
        <ul
          role="list"
          className="grid gap-x-8 gap-y-4 sm:gap-y-6 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xl:col-span-4"
        >
          {bookData.length
            ? bookData
                .filter((book) => {
                  if (genre === "All Genre") {
                    return true;
                  } else {
                    return book.genre === genre;
                  }
                })
                .filter(
                  (book) =>
                    book.title
                      .toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((book) => {
                  return (
                    <li
                      key={book._id}
                      className="text-center border p-3 rounded-md border-gray-500"
                    >
                      <div className="gap-x-6 h-full flex flex-col relative">
                        {user && user.isAdmin && (
                          <span
                            className={`absolute inline-flex items-center rounded-md ${
                              book.availability ? "bg-green-900" : "bg-rose-900"
                            } top-2 left-2 px-2 py-1 text-xs font-medium ring-1 ring-inset ring-blue-700/10 text-white`}
                          >
                            {book.availability ? "In Stock" : "Not Available"}
                          </span>
                        )}
                        <Link to={`/book/${book._id}`}>
                          <img
                            className="mx-auto"
                            src={book.thumbnail}
                            alt="Book"
                          />
                        </Link>
                        <div>
                          <h3 className="text-lg mt-3">
                            <Link
                              to={`/book/${book._id}`}
                              className="font-bold tracking-tight leading-7 leading-tight text-white hover:text-blue-400"
                            >
                              {book.title}
                            </Link>
                          </h3>
                          <p className="text-sm leading-6 text-gray-400">
                            by{" "}
                            <span className="font-semibold">
                              {" "}
                              {book.author}{" "}
                            </span>
                          </p>
                        </div>
                        <div className="w-full pt-2 flex justify-between mt-auto">
                          <label className="text-white">
                            <span className="font-semibold">
                              Rs. {book.price.toFixed(2)}
                            </span>
                          </label>
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {book.genre}
                          </span>
                        </div>
                        {user && user.isAdmin === true ? (
                          <div className="w-full flex gap-2 justify-between items-center">
                            <button
                              onClick={() => {
                                showEditBookModalHandler();
                                setSelectedBook(book);
                              }}
                              className="py-2 px-3 flex-1 flex items-center justify-center gap-2 bg-amber-300 border-amber-200 block mt-2 hover:bg-amber-400 hover:text-black outline-current"
                            >
                              <AiOutlineEdit /> Edit
                            </button>

                            <button
                              onClick={() => {
                                showDeleteBookModalHandler();
                                setTargetBook(book._id);
                              }}
                              className="py- px-3 flex-1 flex items-center justify-center gap-2 border-red-600 text-white bg-red-600 hover:bg-red-700 hover:border-red-700 block mt-2 outline-current"
                            >
                              <AiOutlineDelete />
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="w-full flex justify-between items-center gap-3">
                            <Link
                              to={`/book/${book._id}/showReviewModal`}
                              title="Give Review"
                              className="py-2 block px-3 rounded-lg border border-amber-200 mt-2 text-white hover:bg-amber-300 hover:text-black outline-current"
                            >
                              &#9733;
                            </Link>
                            {book.availability === true ? (
                              <button
                                onClick={() => addToCart(book._id, book.price)}
                                className="py-2 flex-1 border-amber-200 block mt-2 bg-amber-300 hover:bg-amber-400 hover:text-black text-black"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <button
                                className="py-2 flex-1 text-gray-300 border-gray-600 bg-gray-600 hover:border-gray-600 block mt-2 text-black cursor-not-allowed"
                                disabled
                              >
                                Not in Stock
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })
            : ""}
        </ul>
      </div>
    </div>
  );
};

export default Home;
