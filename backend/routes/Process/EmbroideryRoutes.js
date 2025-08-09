import express from "express";
import {
  addEmbriodery,
  deleteEmbroidery,
  getAllDesignNumbers,
  getAllEmbroidery,
  getEmbroideryById,
  getHeadDataByDesignNo,
  getPreviousDataBypartyName,
  replaceEmroideryData,
  updateEmbroidery,
} from "../../controllers/Process/EmbroideryController.js";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";

const embrioderyRouter = express.Router();

embrioderyRouter.post("/addEmbriodery", superAdminAndAdminOnly, addEmbriodery);
embrioderyRouter.post(
  "/getAllEmbroidery",
  superAdminAndAdminOnly,
  getAllEmbroidery
);
embrioderyRouter.post(
  "/getEmbroideryById",
  superAdminAndAdminOnly,
  getEmbroideryById
);
embrioderyRouter.post(
  "/updateEmbroidery",
  superAdminAndAdminOnly,
  updateEmbroidery
);
embrioderyRouter.post(
  "/replaceEmroideryData",
  superAdminAndAdminOnly,
  replaceEmroideryData
);
embrioderyRouter.post(
  "/getPreviousDataBypartyName",
  superAdminAndAdminOnly,
  getPreviousDataBypartyName
);
embrioderyRouter.post(
  "/getAllDesignNumbers",
  superAdminAndAdminOnly,
  getAllDesignNumbers
);
embrioderyRouter.post(
  "/getHeadDataByDesignNo",
  superAdminAndAdminOnly,
  getHeadDataByDesignNo
);
embrioderyRouter.post(
  "/deleteEmbroiderybyId",
  superAdminAndAdminOnly,
  deleteEmbroidery
);

export default embrioderyRouter;
