import express from "express";
import { verifyUser } from "../middleware/Auth.js";
import { generateBuyersBillandAddBuyer, getBuyerById, getBuyersForBranch } from "../controllers/BuyersController.js";


const buyerRouter = express.Router();

buyerRouter.post("/generateBuyersBillandAddBuyer",verifyUser, generateBuyersBillandAddBuyer);
buyerRouter.post("/getBuyersForBranch",verifyUser, getBuyersForBranch);
buyerRouter.post("/getBuyerById",verifyUser, getBuyerById);

export default buyerRouter;
