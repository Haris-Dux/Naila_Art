import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { deleteProcessSuitStock, deleteSuitBillPartAndReverseStock, getAllCategoriesForSuits, getAllSuits, partialDeleteSuitBillColorAndReverseStock } from "../../controllers/Stock/SuitsController.js";


const suitsRouter = express.Router();

suitsRouter.post("/getAllSuits",superAdminAndAdminOnly, getAllSuits);
suitsRouter.post("/getAllCategoriesForSuits",superAdminAndAdminOnly, getAllCategoriesForSuits);
suitsRouter.post("/deleteProcessSuitStock",superAdminAndAdminOnly, deleteProcessSuitStock);
suitsRouter.post("/deleteSuitBillPartAndReverseStock", superAdminAndAdminOnly, deleteSuitBillPartAndReverseStock);
suitsRouter.post("/partialDeleteSuitBillColorAndReverseStock", superAdminAndAdminOnly, partialDeleteSuitBillColorAndReverseStock);

export default suitsRouter;
