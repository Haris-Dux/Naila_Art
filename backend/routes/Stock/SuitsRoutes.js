import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { addSuitsInStock, getAllSuits } from "../../controllers/Stock/SuitsController.js";


const suitsRouter = express.Router();

suitsRouter.post("/addBaseInStock",superAdminAndAdminOnly, addSuitsInStock);
suitsRouter.post("/getAllSuits",superAdminAndAdminOnly, getAllSuits);

export default suitsRouter;
