import express from "express";
import { superAdminAndAdminOnly } from "../middleware/Auth.js";
import {
  generateOtherSaleBill,
  getAllOtherSaleBills,
} from "../controllers/OtherSaleController.js";

const otherSaleRouter = express.Router();

otherSaleRouter.post(
  "/generateOtherSaleBill",
  superAdminAndAdminOnly,
  generateOtherSaleBill
);
otherSaleRouter.post(
  "/getAllOtherSaleBills",
  superAdminAndAdminOnly,
  getAllOtherSaleBills
);


export default otherSaleRouter;
