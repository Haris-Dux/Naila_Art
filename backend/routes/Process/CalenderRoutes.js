import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import {
  addCalender,
  getAllCalender,
  getCalenderByEmbroideryId,
  getCalenderById,
  updateCalender,
} from "../../controllers/Process/CalenderController.js";

const calenderRouter = express.Router();

calenderRouter.post("/addCalender", superAdminAndAdminOnly, addCalender);
calenderRouter.post("/updateCalender", superAdminAndAdminOnly, updateCalender);
calenderRouter.post("/getAllCalender", superAdminAndAdminOnly, getAllCalender);
calenderRouter.post("/getCalenderByEmbroideryId", superAdminAndAdminOnly, getCalenderByEmbroideryId);
calenderRouter.post(
  "/getCalenderById",
  superAdminAndAdminOnly,
  getCalenderById
);


export default calenderRouter;
