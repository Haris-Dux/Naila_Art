

import express from 'express';
import { verifyUser} from "../../middleware/Auth.js";
import { cashBookController } from '../../controllers/CashBook/CashBookController.js';

const cashBookRouter = express.Router();

cashBookRouter.get("/getAllCashBookEntries",verifyUser,cashBookController.getAllCashBookEntries);

export default cashBookRouter;