
import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { addStone, getAllStone, getStoneByEmbroideryId, getStoneById, updateStone } from "../../controllers/Process/StoneController.js";

const stitchingRouter = express.Router();

stitchingRouter.post("/addStone", superAdminAndAdminOnly , addStone);
stitchingRouter.post("/getAllStone", superAdminAndAdminOnly , getAllStone);
stitchingRouter.post("/getStoneById", superAdminAndAdminOnly , getStoneById);
stitchingRouter.post("/getStoneByEmbroideryId", superAdminAndAdminOnly , getStoneByEmbroideryId);
stitchingRouter.post("/updateStone", superAdminAndAdminOnly , updateStone);


export default stitchingRouter;
