import express from "express";
import { verifyUser } from "../../middleware/Auth.js";
import {
  addBuyerCheck,
  getAllChecksForParty,
  markCheckAsPaid,
  updateBuyerCheckWithNew,
} from "../../controllers/Checks/CheckController.js";

const checkRouter = express.Router();

checkRouter.post("/addBuyerCheck", verifyUser, addBuyerCheck);
checkRouter.post(
  "/updateBuyerCheckWithNew",
  verifyUser,
  updateBuyerCheckWithNew
);
checkRouter.post("/markCheckAsPaid", verifyUser, markCheckAsPaid);
checkRouter.post("/getAllChecksForParty", verifyUser, getAllChecksForParty);

export default checkRouter;
