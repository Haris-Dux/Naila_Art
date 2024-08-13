
import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { addLaceInStock, getAllLaceForEmbroidery, getAllLaceStock } from "../../controllers/Stock/LaceController.js";


const laceRouter = express.Router();

laceRouter.post("/addLaceInStock",superAdminAndAdminOnly, addLaceInStock);
laceRouter.post("/getAllLaceStock",superAdminAndAdminOnly, getAllLaceStock);
laceRouter.post("/getAllLaceForEmbroidery",superAdminAndAdminOnly, getAllLaceForEmbroidery);

export default laceRouter;
