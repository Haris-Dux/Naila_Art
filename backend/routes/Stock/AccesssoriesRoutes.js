import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import {
  addAccesoriesInStock,
  getAllAccesoriesInStock,
  updateAllAccesoriesInStock,
} from "../../controllers/Stock/AccessoriesController.js";

const accessoriesRouter = express.Router();

accessoriesRouter.post(
  "/addAccesoriesInStock",
  superAdminAndAdminOnly,
  addAccesoriesInStock
);
accessoriesRouter.post(
  "/getAllAccesoriesInStock",
  superAdminAndAdminOnly,
  getAllAccesoriesInStock
);
accessoriesRouter.post(
  "/updateAllAccesoriesInStock",
  superAdminAndAdminOnly,
  updateAllAccesoriesInStock
);

export default accessoriesRouter;
