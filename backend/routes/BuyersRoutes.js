import express from "express";
import { verifyUser } from "../middleware/Auth.js";
import {
  generateBillForOldbuyer,
  generateBuyersBillandAddBuyer,
  generatePdfFunction,
  getBuyerBillHistoryForBranch,
  getBuyerById,
  getBuyersForBranch,
  validateAndGetOldBuyerData,
  validateD_NoAndGetSuitData,
} from "../controllers/BuyersController.js";

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

export default buyerRouter;
