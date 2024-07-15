import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import ShopSlice from "../features/ShopSlice";
import PurchaseBillsSlice from "../features/PurchaseBillsSlice";
import InStockSlice from "../features/InStockSlice";
import EmbroiderySlice from "../features/EmbroiderySlice";
import CalenderSlice from "../features/CalenderSlice";
import CuttingSlice from "../features/CuttingSlice";
import stoneslice from "../features/stoneslice";
import stitching from "../features/stitching";
import AccountSlice from "../features/AccountSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    Shop: ShopSlice,
PurchaseBills:PurchaseBillsSlice,
InStock:InStockSlice,
Embroidery:EmbroiderySlice,
Calender:CalenderSlice,
Cutting:CuttingSlice,
stone:stoneslice,
stitching:stitching,
Account:AccountSlice




  },
});