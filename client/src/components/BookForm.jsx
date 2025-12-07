import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { addBook, editBook } from "../apicalls/books";
import { AiOutlineClose } from "react-icons/ai";

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
const BookForm = ({
  userId,
  getAllBooksOnLoad,
  showAddBookModalHandler,
  formType,
  selectedBook,
  getBookData,
  singleBook,
  booksAddedByUser,
  isEditedFromProfile,
}) => {
  console.log(selectedBook);
  const [title, setTitle] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [author, setAuthor] = useState("");
  const [isAuthorValid, setIsAuthorValid] = useState(true);
  const [genre, setGenre] = useState("");
  const [isGenreValid, setIsGenreValid] = useState(true);
  const [price, setPrice] = useState("");
  const [isPriceValid, setIsPriceValid] = useState(true);
  const [available, setAvailable] = useState("yes");
  const [thumbnail, setThumbnail] = useState("");
  const [isThumbnailValid, setIsThumbnailValid] = useState(true);

  const dispatch = useDispatch();
  const titleRef = useRef();
  const authoreRef = useRef();
  const priceRef = useRef();
  const thumbnailRef = useRef();

  const sendBookToDatabase = async (data) => {
    try {
      dispatch(showLoading());
      let response = null;
      if (formType == "Add") {
        response = await addBook(JSON.stringify(data));
      } else {
        let updatedData = { ...data, bookId: selectedBook._id };
        response = await editBook(JSON.stringify(updatedData));
        if (singleBook) {
          getBookData();
          showAddBookModalHandler();
        }
      }
      if (response.success) {
        toast.success(response.message);
        showAddBookModalHandler();
        if (isEditedFromProfile) {
          booksAddedByUser();
        } else {
          getAllBooksOnLoad();
        }
      } else {
        dispatch(hideLoading());
        toast.error(response.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error(err);
    }
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    let areAllFieldsGood = true;

    if (title == "" || title.trim().length == 0) {
      setIsTitleValid(false);
      areAllFieldsGood = false;
    }
    if (author == "" || author.trim().length == 0) {
      setIsAuthorValid(false);
      areAllFieldsGood = false;
    }
    if (genre == "" || genre.trim().length == 0) {
      setIsGenreValid(false);
      areAllFieldsGood = false;
    }
    if (price == "") {
      setIsPriceValid(false);
      areAllFieldsGood = false;
    }
    if (thumbnail == "" || thumbnail.trim().length == 0) {
      setIsThumbnailValid(false);
      areAllFieldsGood = false;
    }

    if (!areAllFieldsGood) {
      return;
    }

    const data = {
      title: titleRef.current.value,
      author: authoreRef.current.value,
      price: priceRef.current.value,
      genre: genre,
      availability: available === "yes" ? true : false,
      thumbnail: thumbnailRef.current.value,
      user: userId,
    };
    sendBookToDatabase(data);
  };

  useEffect(() => {
    if (formType === "Edit") {
      setTitle(selectedBook.title);
      setAuthor(selectedBook.author);
      setPrice(selectedBook.price);
      setGenre(selectedBook.genre);
      setThumbnail(selectedBook.thumbnail);
      if (selectedBook.availability) {
        setAvailable("yes");
      } else {
        setAvailable("no");
      }
    }
  }, [formType]);

  return (
    <div className="modal-body">
      <div className="flex w-full justify-between items-center border-gray-500 border-b-2 border-b-gray-500 mb-4">
        <h3 className="text-black text-2xl font-bold">
          {formType === "Add" ? "Add" : "Edit"} Book
        </h3>
        <AiOutlineClose
          className="text-black cursor-pointer"
          onClick={showAddBookModalHandler}
        />
      </div>
      <form>
        <label className="block" htmlFor="title">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Title
          </span>
          <input
            type="text"
            name="title"
            id="title"
            ref={titleRef}
            required={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            placeholder="Enter book title"
          />
        </label>
        {!isTitleValid && !title.length && (
          <span className="text-sm text-red-500">Title is required!</span>
        )}
        <div className="grid gap-x-4 gap-y-4 sm:gap-y-4 xl:grid-cols-2 sm:grid-cols-1">
          <label className="block mt-3" htmlFor="author">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              Author
            </span>
            <input
              type="text"
              name="author"
              id="author"
              ref={authoreRef}
              required={true}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Enter the author name"
            />
            {!isAuthorValid && !author.length && (
              <span className="text-sm text-red-500">Author is required!</span>
            )}
          </label>
          <label className="block xl:mt-3" htmlFor="genre">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              Genre
            </span>
            <select
              id="genre"
              required={true}
              onChange={(e) => setGenre(e.target.value)}
              value={genre}
              className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            >
              <option key="0" value="">
                Select Genre
              </option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {!isGenreValid && !genre.length && (
              <span className="text-sm text-red-500">Author is required!</span>
            )}
          </label>
        </div>
        <div className="grid gap-x-4 gap-y-4 sm:gap-y-4 xl:grid-cols-2 sm:grid-cols-1">
          <label className="block mt-3" htmlFor="price">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              Price
            </span>
            <input
              type="number"
              name="text"
              id="price"
              ref={priceRef}
              required={true}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
              placeholder="Enter the author name"
            />
            {!isPriceValid && !price.length && (
              <span className="text-sm text-red-500">Price is required!</span>
            )}
          </label>

          <label className="block xl:mt-3">
            <span className="block text-sm font-medium text-slate-700">
              Is this book in stock?
            </span>
            <div className="user-type flex border overflow-hidden rounded-md border-gray-300 mt-1">
              <div className="flex-1 text-center">
                <input
                  type="radio"
                  name="available"
                  hidden
                  id="yes"
                  onClick={() => setAvailable("yes")}
                />
                <label
                  htmlFor="yes"
                  className={`block py-2 text-black text-sm cursor-pointer ${
                    available === "yes" ? "active" : ""
                  }`}
                >
                  Yes
                </label>
              </div>
              <div className="flex-1 text-center">
                <input
                  type="radio"
                  name="available"
                  hidden
                  id="no"
                  onClick={() => setAvailable("no")}
                />
                <label
                  htmlFor="no"
                  className={`block py-2 text-black text-sm cursor-pointer ${
                    available === "no" ? "active" : ""
                  }`}
                >
                  No
                </label>
              </div>
            </div>
          </label>
        </div>
        <label className="block mt-3" htmlFor="thumbnail">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Thumbnail
          </span>
          <input
            type="text"
            name="text"
            id="thumbnail"
            ref={thumbnailRef}
            required={true}
            onChange={(e) => setThumbnail(e.target.value)}
            value={thumbnail}
            className="mt-1 px-3 py-2 bg-white text-black border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            placeholder="Enter the URL of book image"
          />
          {!isThumbnailValid && !thumbnail.length && (
            <span className="text-sm text-red-500">Thumbnail is required!</span>
          )}
        </label>

        <div className="modal-footer flex gap-3 pt-2 mt-4">
          <button
            type="button"
            onClick={showAddBookModalHandler}
            className="py-2 flex-1 border-gray-400 block mt-2 bg-transparent text-black hover:bg-gray-100 hover:text-black text-black"
          >
            Cancel
          </button>
          <button
            onClick={formSubmitHandler}
            className="py-2 flex-1 border-amber-200 block mt-2 bg-amber-300 hover:bg-amber-400 hover:text-black text-black"
          >
            {formType == "Add" ? "Add" : "Update"} Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
