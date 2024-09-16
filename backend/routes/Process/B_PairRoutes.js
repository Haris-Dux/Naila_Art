


import express from "express";
import { superAdminAndAdminOnly, verifyUser } from "../../middleware/Auth.js";
import { getAllBPairs, saleBPair } from "../../controllers/Process/B_PairController.js";

const b_PairRouter = express.Router();

b_PairRouter.post("/saleBPair", verifyUser, saleBPair);
b_PairRouter.post("/getAllBPairs", superAdminAndAdminOnly, getAllBPairs);



export default b_PairRouter;
