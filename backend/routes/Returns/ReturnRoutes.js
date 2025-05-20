
import express from 'express';
import { createReturn, getAllReturnsForBranch } from '../../controllers/Returns/ReturnsController.js';
import { verifyUser} from "../../middleware/Auth.js";

const returnRouter = express.Router();

returnRouter.post("/createReturn",verifyUser,createReturn);
returnRouter.post("/getAllReturnsForBranch",verifyUser,getAllReturnsForBranch);

export default returnRouter;