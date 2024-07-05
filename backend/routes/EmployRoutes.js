
import express from "express";
import { superAdminOnly } from "../middleware/Auth.js";
import { addEmploye } from "../controllers/EmployController.js";

const employRouter = express.Router();

employRouter.post("/addEmploye", superAdminOnly, addEmploye);


export default employRouter;
