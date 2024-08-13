import express from "express";
import {
  addInStockAndGeneraeSellerData_NEW,
  addInStockAndGeneraeSellerData_OLD,
  getAllPurchasingHistory,
  getAllSellersForPurchasing,
  getSelleForPurchasingById,
  validateAndGetOldSellerData,
} from "../../controllers/sellers/SellersController.js";
import { superAdminOnly } from "../../middleware/Auth.js";

const sellerRouter = express.Router();

sellerRouter.post(
  "/addInStockAndGeneraeSellerData_NEW",
  superAdminOnly,
  addInStockAndGeneraeSellerData_NEW
);
sellerRouter.post(
  "/getSelleForPurchasingById",
  superAdminOnly,
  getSelleForPurchasingById
);
sellerRouter.post(
  "/getAllSellersForPurchasing",
  superAdminOnly,
  getAllSellersForPurchasing
);
sellerRouter.post(
  "/validateAndGetOldSellerData",
  superAdminOnly,
  validateAndGetOldSellerData
);
sellerRouter.post(
  "/addInStockAndGeneraeSellerData_OLD",
  superAdminOnly,
  addInStockAndGeneraeSellerData_OLD
);
sellerRouter.post(
  "/getAllPurchasingHistory",
  superAdminOnly,
  getAllPurchasingHistory
);

export default sellerRouter;
