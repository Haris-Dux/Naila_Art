
import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { addCutting, getAllCutting, getCuttingByEmbroideryId, getCuttingById, updateCutting } from "../../controllers/Process/CuttingControler.js";

const cuttingRouter = express.Router();

cuttingRouter.post("/addCutting", superAdminAndAdminOnly, addCutting);
cuttingRouter.post("/updateCutting", superAdminAndAdminOnly, updateCutting);
cuttingRouter.post("/getAllCutting", superAdminAndAdminOnly, getAllCutting);
cuttingRouter.post("/getCuttingByEmbroideryId", superAdminAndAdminOnly, getCuttingByEmbroideryId);
cuttingRouter.post(
  "/getCuttingById",
  superAdminAndAdminOnly,
  getCuttingById
);


export default cuttingRouter;
