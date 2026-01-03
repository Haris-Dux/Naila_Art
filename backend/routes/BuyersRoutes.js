import express from "express";
import { superAdminOnly, verifyUser } from "../middleware/Auth.js";
import {
  deleteBuyerBill,
  generateBillForOldbuyer,
  generateBuyersBillandAddBuyer,
  generatePdfFunction,
  getBuyerBillHistoryForBranch,
  getBuyerById,
  getBuyersForBranch,
  validateAndGetOldBuyerData,
  validateD_NoAndGetSuitData,
} from "../controllers/BuyersController.js";
import { markAsPaidForBuyers } from "../controllers/CashInOutController.js";

const buyerRouter = express.Router();

buyerRouter.post(
  "/generateBuyersBillandAddBuyer",
  verifyUser,
  generateBuyersBillandAddBuyer
);
buyerRouter.post("/getBuyersForBranch", verifyUser, getBuyersForBranch);
buyerRouter.post("/getBuyerById", verifyUser, getBuyerById);
buyerRouter.post(
  "/validateD_NoAndGetSuitData",
  verifyUser,
  validateD_NoAndGetSuitData
);
buyerRouter.post(
  "/validateAndGetOldBuyerData",
  verifyUser,
  validateAndGetOldBuyerData
);
buyerRouter.post(
  "/generateBillForOldbuyer",
  verifyUser,
  generateBillForOldbuyer
);
buyerRouter.post("/generatePdfFunction", verifyUser, generatePdfFunction);
buyerRouter.post(
  "/getBuyerBillHistoryForBranch",
  verifyUser,
  getBuyerBillHistoryForBranch
);
buyerRouter.post(
  "/markAsPaidForBuyers",
  verifyUser,
  markAsPaidForBuyers
);
buyerRouter.post(
  "/deleteBuyerBill/:billId",
  superAdminOnly,
  deleteBuyerBill
);

export default buyerRouter;
