import express from "express";
import { superAdminAndAdminOnly, verifyUser } from "../middleware/Auth.js";
import {
  cashIn,
  cashOut,
  getTodaysCashInOut,
  validatePartyNameForMainBranch,
  validatePartyNameForOtherBranches,
} from "../controllers/CashInOutController.js";

const cashInOutRouter = express.Router();

cashInOutRouter.post("/cashIn", verifyUser, cashIn);
cashInOutRouter.post("/cashOut", verifyUser, cashOut);
cashInOutRouter.post("/validatePartyNameForMainBranch", superAdminAndAdminOnly, validatePartyNameForMainBranch);
cashInOutRouter.post("/validatePartyNameForOtherBranches", verifyUser, validatePartyNameForOtherBranches);
cashInOutRouter.post("/getTodaysCashInOut", verifyUser, getTodaysCashInOut);


export default cashInOutRouter;
