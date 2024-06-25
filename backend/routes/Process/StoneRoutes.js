
import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { addStone, getAllStone, getStoneByEmbroideryId, getStoneById, updateStone } from "../../controllers/Process/StoneController.js";

const stoneRouter = express.Router();

stoneRouter.post("/addStone", superAdminAndAdminOnly , addStone);
stoneRouter.post("/getAllStone", superAdminAndAdminOnly , getAllStone);
stoneRouter.post("/getStoneById", superAdminAndAdminOnly , getStoneById);
stoneRouter.post("/getStoneByEmbroideryId", superAdminAndAdminOnly , getStoneByEmbroideryId);
stoneRouter.post("/updateStone", superAdminAndAdminOnly , updateStone);


export default stoneRouter;
