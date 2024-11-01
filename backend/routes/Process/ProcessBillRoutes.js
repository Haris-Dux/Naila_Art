import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import {
  deleteBillAndProcessOrder,
  generateGatePassPdfFunction,
  generateProcessBill,
  getAllProcessBills,
  getProcessillById,
} from "../../controllers/Process/ProcessBillsController.js";

const processBillRouter = express.Router();

processBillRouter.post(
  "/generateProcessBill",
  superAdminAndAdminOnly,
  generateProcessBill
);
processBillRouter.post(
  "/getProcessillById",
  superAdminAndAdminOnly,
  getProcessillById
);
processBillRouter.post(
    "/getAllProcessBills",
    superAdminAndAdminOnly,
    getAllProcessBills
  );
processBillRouter.post(
    "/generateGatePassPdfFunction",
    superAdminAndAdminOnly,
    generateGatePassPdfFunction
  );
  processBillRouter.post(
    "/deleteBillAndProcessOrder",
    superAdminAndAdminOnly,
    deleteBillAndProcessOrder
  );


export default processBillRouter;
