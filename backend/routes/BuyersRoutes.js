import express from "express";
import { verifyUser } from "../middleware/Auth.js";
import { generateBuyersBillandAddBuyer } from "../controllers/BuyersController.js";


const buyerRouter = express.Router();

buyerRouter.post("/generateBuyersBillandAddBuyer",verifyUser, generateBuyersBillandAddBuyer);

export default buyerRouter;
