import express from "express";
import { superAdminAndAdminOnly, verifyUser } from "../middleware/Auth.js";
import {
  cashIn,
  validatePartyNameForMainBranch,
  validatePartyNameForOtherBranches,
} from "../controllers/CashInOutController.js";

const cashInOutRouter = express.Router();

cashInOutRouter.post("/cashIn", verifyUser, cashIn);
cashInOutRouter.post(
  "/validatePartyNameForMainBranch",
  superAdminAndAdminOnly,
  validatePartyNameForMainBranch
);
cashInOutRouter.post(
  "/validatePartyNameForOtherBranches",
  verifyUser,
  validatePartyNameForOtherBranches
);

export default cashInOutRouter;
