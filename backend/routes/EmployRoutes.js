import express from "express";
import { superAdminOnly, verifyUser } from "../middleware/Auth.js";
import {
  addEmploye,
  addLeave,
  creditDebitBalance,
  creditSalaryForSingleEmploye,
  getAllActiveEmploye,
  getAllPastEmploye,
  getEmployeDataById,
  updateEmploye,
} from "../controllers/EmployController.js";

const employRouter = express.Router();

employRouter.post("/addEmploye", superAdminOnly, addEmploye);
employRouter.post("/creditDebitBalance", superAdminOnly, creditDebitBalance);
employRouter.post(
  "/creditSalaryForSingleEmploye",
  superAdminOnly,
  creditSalaryForSingleEmploye
);
employRouter.post("/updateEmploye", superAdminOnly, updateEmploye);
employRouter.post("/getEmployeDataById", superAdminOnly, getEmployeDataById);
employRouter.post("/getAllActiveEmploye", superAdminOnly, getAllActiveEmploye);
employRouter.post("/getAllPastEmploye", superAdminOnly, getAllPastEmploye);
employRouter.post("/addLeave", verifyUser, addLeave);

export default employRouter;
