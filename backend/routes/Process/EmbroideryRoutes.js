import express from "express";
import { addEmbriodery } from "../../controllers/Process/EmbroideryController.js";
import { superAdminOnly } from "../../middleware/Auth.js";

const embrioderyRouter = express.Router();

embrioderyRouter.post("/addEmbriodery", superAdminOnly, addEmbriodery);


export default embrioderyRouter;
