


import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import { createPictureOrder, deletePictureOrderById, getAllPictureOrders, getPictureOrderById, updatePictureOrderById } from "../../controllers/Process/PicturesController.js";

const pictureRouter = express.Router();

pictureRouter.post("/createPictureOrder", superAdminAndAdminOnly, createPictureOrder);
pictureRouter.post("/getPictureOrderById", superAdminAndAdminOnly, getPictureOrderById);
pictureRouter.post("/deletePictureOrderById", superAdminAndAdminOnly, deletePictureOrderById);
pictureRouter.post("/updatePictureOrderById", superAdminAndAdminOnly, updatePictureOrderById);
pictureRouter.post("/getAllPictureOrders", superAdminAndAdminOnly, getAllPictureOrders);



export default pictureRouter;
