import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import {
  addStitching,
  getAllStitching,
  getStitchingByEmbroideryId,
  getStitchingById,
  updateStitching,
} from "../../controllers/Process/StitchingController.js";

const stitchingRouter = express.Router();

stitchingRouter.post("/addStitching", superAdminAndAdminOnly, addStitching);
stitchingRouter.post(
  "/getAllStitching",
  superAdminAndAdminOnly,
  getAllStitching
);
stitchingRouter.post(
  "/getStitchingById",
  superAdminAndAdminOnly,
  getStitchingById
);
stitchingRouter.post(
  "/getStitchingByEmbroideryId",
  superAdminAndAdminOnly,
  getStitchingByEmbroideryId
);
stitchingRouter.post(
  "/updateStitching",
  superAdminAndAdminOnly,
  updateStitching
);

export default stitchingRouter;
