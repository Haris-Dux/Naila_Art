import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import ShopSlice from "../features/ShopSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    Shop: ShopSlice,

  },
});