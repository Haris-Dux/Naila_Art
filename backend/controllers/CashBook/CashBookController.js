import { cashBookService } from "../../services/CashbookService.js";

export const cashBookController = {
    getAllCashBookEntries : async (req,res,next) => {
        try {
           const data =  await cashBookService.getAllCashBookEntries(req);
           return res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }
};
