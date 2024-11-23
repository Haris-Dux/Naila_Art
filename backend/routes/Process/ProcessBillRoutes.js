import express from "express";
import { superAdminAndAdminOnly } from "../../middleware/Auth.js";
import {
  applyDiscountOnProcessAccount,
  claimProcessAccount,
  deleteBillAndProcessOrder,
  generateGatePassPdfFunction,
  generateProcessBill,
  getAllProcessBills,
  getProcessillById,
  markAsPaid,
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
  processBillRouter.post(
    "/markAsPaid",
    superAdminAndAdminOnly,
    markAsPaid
  );
  processBillRouter.post(
    "/applyDiscountOnProcessAccount",
    superAdminAndAdminOnly,
    applyDiscountOnProcessAccount
  );
  processBillRouter.post(
    "/claimProcessAccount",
    superAdminAndAdminOnly,
    claimProcessAccount
  );

export default processBillRouter;
