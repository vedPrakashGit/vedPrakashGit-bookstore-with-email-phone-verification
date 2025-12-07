import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    fetchCartForStore: (state, action) => {
      state = action.payload;
      return state;
    },
    addToCartForStore: (state, action) => {
      state.push(action.payload);
      return state;
    },
    removeFromCartForStore: (state, action) => {
      state.filter((id) => id === action.payload.id);
      return state;
    },
  },
});

export const { fetchCartForStore, addToCartForStore, removeFromCartForStore } =
  cartSlice.actions;
export default cartSlice.reducer;

// export const getCartItems = createAsyncThunk("cartItems", async () => {
//   const res = await getCart({ user: user._id });
//   return res.data;
// });
