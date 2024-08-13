
import express from "express";
import { verifyUser } from "../middleware/Auth.js";
import { cashIn } from "../controllers/CashInOutController.js";



const cashInOutRouter = express.Router();

cashInOutRouter.post("/cashIn",verifyUser, cashIn);


export default cashInOutRouter;
