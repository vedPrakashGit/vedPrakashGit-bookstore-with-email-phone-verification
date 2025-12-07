import { axiosInstance } from ".";

export const createCart = async (data) => {
  try {
    const response = await axiosInstance.post("/api/carts/create-cart", data);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const getCart = async (id) => {
  try {
    const response = await axiosInstance.post("/api/carts/get-cart", id);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const updateCart = async (data) => {
  try {
    const response = await axiosInstance.put("/api/carts/update-cart", data);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const removeCart = async (id) => {
  try {
    const response = await axiosInstance.post("/api/carts/remove-cart", id);
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const emptyCart = async (id) => {
  try {
    const response = await axiosInstance.post("/api/carts/empty-cart", id);
    return response.data;
  } catch (err) {
    return err.response;
  }
};
