import { axiosInstance } from ".";

export const makePayment = async (token, amount) => {
  try {
    const response = await axiosInstance.post("/api/purchases/make-payment", {
      token,
      amount,
    });
    console.log(token, amount, response);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const addToPurchase = async (values) => {
  try {
    const response = await axiosInstance.post(
      "/api/purchases/add-to-purchase",
      values
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getPurchasedBooks = async (obj) => {
  try {
    const response = await axiosInstance.post(
      "/api/purchases/get-purchased-books",
      obj
    );
    return response.data;
  } catch (err) {
    return err.response;
  }
};
