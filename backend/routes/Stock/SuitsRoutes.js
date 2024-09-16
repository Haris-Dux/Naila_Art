import express from "express";
import { superAdminAndAdminOnly,verifyUser } from "../../middleware/Auth.js";
import { addSuitsInStock, getAllCategoriesForSuits, getAllSuits } from "../../controllers/Stock/SuitsController.js";


const suitsRouter = express.Router();

suitsRouter.post("/addBaseInStock",superAdminAndAdminOnly, addSuitsInStock);
suitsRouter.post("/getAllSuits",superAdminAndAdminOnly, getAllSuits);
suitsRouter.post("/getAllCategoriesForSuits",superAdminAndAdminOnly, getAllCategoriesForSuits);

export default suitsRouter;
