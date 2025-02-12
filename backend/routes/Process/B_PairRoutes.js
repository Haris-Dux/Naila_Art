


import express from "express";
import { superAdminAndAdminOnly, verifyUser } from "../../middleware/Auth.js";
import { deletebPair, getAllBPairs, reverseBpairSale, saleBPair } from "../../controllers/Process/B_PairController.js";

const b_PairRouter = express.Router();

b_PairRouter.post("/saleBPair", verifyUser, saleBPair);
b_PairRouter.post("/getAllBPairs", superAdminAndAdminOnly, getAllBPairs);
b_PairRouter.post("/reverseBpairSale", superAdminAndAdminOnly, reverseBpairSale);
b_PairRouter.delete("/deletebPair/:id", superAdminAndAdminOnly, deletebPair);



export default b_PairRouter;
