import express from "express";
import { superAdminOnly, verifyUser } from "../middleware/Auth.js";
import {
  createBranch,
  deleteBranch,
  getAllBranches,
  updateBranch,
} from "../controllers/Branch.Controller.js";

const branchRouter = express.Router();

branchRouter.post("/createBranch", superAdminOnly, createBranch);
branchRouter.post("/updateBranch", superAdminOnly, updateBranch);
branchRouter.post("/deleteBranch", superAdminOnly, deleteBranch);
branchRouter.post("/getAllBranches", verifyUser, getAllBranches);

export default branchRouter;
