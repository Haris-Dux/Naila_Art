import express from "express";
import { addBaseInStock, getAllBases } from "../../controllers/Stock/BaseController.js";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";


const baseRouter = express.Router();

baseRouter.post("/addBaseInStock",superAdminAndAdminOnly, addBaseInStock);
baseRouter.post("/getAllBases",superAdminAndAdminOnly, getAllBases);

export default baseRouter;
