import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { addSuitsInStock, deleteProcessSuitStock, getAllCategoriesForSuits, getAllSuits } from "../../controllers/Stock/SuitsController.js";


const suitsRouter = express.Router();

suitsRouter.post("/addBaseInStock",superAdminAndAdminOnly, addSuitsInStock);
suitsRouter.post("/getAllSuits",superAdminAndAdminOnly, getAllSuits);
suitsRouter.post("/getAllCategoriesForSuits",superAdminAndAdminOnly, getAllCategoriesForSuits);
suitsRouter.post("/deleteProcessSuitStock",superAdminAndAdminOnly, deleteProcessSuitStock);


export default suitsRouter;
