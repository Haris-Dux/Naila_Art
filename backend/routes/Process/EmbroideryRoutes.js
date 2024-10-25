import express from "express";
import { addEmbriodery, getAllDesignNumbers, getAllEmbroidery, getEmbroideryById, getHeadDataByDesignNo, getPreviousDataBypartyName, updateEmbroidery } from "../../controllers/Process/EmbroideryController.js";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";

const embrioderyRouter = express.Router();

embrioderyRouter.post("/addEmbriodery", superAdminAndAdminOnly, addEmbriodery);
embrioderyRouter.post("/getAllEmbroidery", superAdminAndAdminOnly, getAllEmbroidery);
embrioderyRouter.post("/getEmbroideryById", superAdminAndAdminOnly, getEmbroideryById);
embrioderyRouter.post("/updateEmbroidery", superAdminAndAdminOnly, updateEmbroidery);
embrioderyRouter.post("/getPreviousDataBypartyName", superAdminAndAdminOnly, getPreviousDataBypartyName);
embrioderyRouter.post("/getAllDesignNumbers", superAdminAndAdminOnly, getAllDesignNumbers);
embrioderyRouter.post("/getHeadDataByDesignNo", superAdminAndAdminOnly, getHeadDataByDesignNo);


export default embrioderyRouter;
