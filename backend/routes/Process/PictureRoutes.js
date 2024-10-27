


import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { createPictureOrder } from "../../controllers/Process/PicturesController.js";

const pictureRouter = express.Router();

pictureRouter.post("/createPictureOrder", superAdminAndAdminOnly, createPictureOrder);



export default pictureRouter;
