import express from "express";
import {
  addBaseInStock,
  deleteBaseStock,
  getAllBases,
  getAllBasesForEmbroidery,
  getAllCategoriesForbase,
} from "../../controllers/Stock/BaseController.js";
import { superAdminAndAdminOnly, verifyUser } from "../../middleware/Auth.js";

const baseRouter = express.Router();

baseRouter.post("/addBaseInStock", superAdminAndAdminOnly, addBaseInStock);
baseRouter.post("/getAllBases", verifyUser, getAllBases);
baseRouter.post(
  "/getAllCategoriesForbase",
  verifyUser,
  getAllCategoriesForbase
);
baseRouter.post(
  "/getAllBasesForEmbroidery",
  verifyUser,
  getAllBasesForEmbroidery
);
baseRouter.post(
  "/deleteBaseStock",
  verifyUser,
  deleteBaseStock
);

export default baseRouter;
