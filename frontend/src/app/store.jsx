import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import ShopSlice from "../features/ShopSlice";
import PurchaseBillsSlice from "../features/PurchaseBillsSlice";
import InStockSlice from "../features/InStockSlice";
import EmbroiderySlice from "../features/EmbroiderySlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    Shop: ShopSlice,
PurchaseBills:PurchaseBillsSlice,
InStock:InStockSlice,
Embroidery:EmbroiderySlice
  },
});