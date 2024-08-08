import express from "express";
import {
  addBaseInStock,
  getAllBases,
  getAllBasesForEmbroidery,
  getAllCategoriesForbase,
} from "../../controllers/Stock/BaseController.js";
import { superAdminAndAdminOnly, verifyUser } from "../../middleware/Auth.js";

const baseRouter = express.Router();

baseRouter.post("/addBaseInStock", superAdminAndAdminOnly, addBaseInStock);
baseRouter.post("/getAllBases", superAdminAndAdminOnly, getAllBases);
baseRouter.post(
  "/getAllCategoriesForbase",
  superAdminAndAdminOnly,
  getAllCategoriesForbase
);
baseRouter.post(
  "/getAllBasesForEmbroidery",
  verifyUser,
  getAllBasesForEmbroidery
);

export default baseRouter;
