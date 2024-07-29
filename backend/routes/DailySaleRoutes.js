import express from "express";
import { verifyUser } from "../middleware/Auth.js";
import { getDailySaleById, getDailySaleHistoryForBranch, getTodaysdailySaleforBranch } from "../controllers/DailySaleController.js";


const dailySaleRouter = express.Router();

dailySaleRouter.post("/getTodaysdailySaleforBranch",verifyUser, getTodaysdailySaleforBranch);
dailySaleRouter.post("/getDailySaleHistoryForBranch",verifyUser, getDailySaleHistoryForBranch);
dailySaleRouter.post("/getDailySaleById",verifyUser, getDailySaleById);


export default dailySaleRouter;
