import express from "express";
import { addEmbriodery, getAllEmbroidery, getEmbroideryById } from "../../controllers/Process/EmbroideryController.js";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";

const embrioderyRouter = express.Router();

embrioderyRouter.post("/addEmbriodery", superAdminAndAdminOnly, addEmbriodery);
embrioderyRouter.post("/getAllEmbroidery", superAdminAndAdminOnly, getAllEmbroidery);
embrioderyRouter.post("/getEmbroideryById", superAdminAndAdminOnly, getEmbroideryById);


export default embrioderyRouter;
