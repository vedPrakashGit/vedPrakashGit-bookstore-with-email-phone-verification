import { axiosInstance } from ".";

export const getAllBooks = async () => {
  try {
    const response = await axiosInstance.get("/api/books/get-all-books");
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/api/books/get-book-by-id/${id}`
    );
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const addBook = async (data) => {
  try {
    const response = await axiosInstance.post("/api/books/add-book", data);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const editBook = async (data) => {
  try {
    const response = await axiosInstance.put("/api/books/update-book", data);
    console.log(response);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await axiosInstance.post("/api/books/delete-book", id);
    console.log(response);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getBooksAddedByUser = async (id) => {
  try {
    const response = await axiosInstance.post(
      "/api/books/books-added-by-user",
      id
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};
