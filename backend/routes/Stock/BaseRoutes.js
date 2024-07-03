import express from "express";
import { addBaseInStock, getAllBases, getAllCategoriesForbase } from "../../controllers/Stock/BaseController.js";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";


const baseRouter = express.Router();

baseRouter.post("/addBaseInStock",superAdminAndAdminOnly, addBaseInStock);
baseRouter.post("/getAllBases",superAdminAndAdminOnly, getAllBases);
baseRouter.post("/getAllCategoriesForbase",superAdminAndAdminOnly, getAllCategoriesForbase);

export default baseRouter;
