import mongoose from "mongoose";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const generateProcessBill = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        process_Category,
        serial_No,
        partyName,
        design_no,
        date,
        T_Quantity,
        rate,
        r_quantity,
        recieved_suit,
      } = req.body;

      // Validate required fields
      if (
        !process_Category ||
        !serial_No ||
        !partyName ||
        !design_no ||
        !date ||
        !rate ||
        !T_Quantity
      ) {
        throw new Error("Required fields are missing");
      }
      if (process_Category === "Embroidery" && !recieved_suit) {
        throw new Error("Required fields are missing");
      }
      if (process_Category !== "Embroidery" && !r_quantity) {
        throw new Error("Required fields are missing");
      }

      //AMOUNT TO PAY IN THE BILL
      const amount = rate * recieved_suit;
      if (amount === 0 || amount < 0) throw new Error("Invalid Balance Amount");

      //DATA FOR VIRTUAL ACCOUNT
      const total_credit = amount;
      const total_balance = amount;

      const virtualAccountData = {
        total_credit,
        total_balance,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const credit_debit_history_details = [
        {
          date,
          particular: `Serial No ${serial_No}`,
          credit: amount,
          balance: amount,
        },
      ];

      await processBillsModel.create(
        [
          {
            process_Category,
            serial_No,
            partyName,
            design_no,
            date,
            T_Quantity,
            rate,
            r_quantity:
              process_Category === "Embroidery" ? recieved_suit : r_quantity,
            recieved_suit,
            credit_debit_history: credit_debit_history_details,
            virtual_account: virtualAccountData,
          },
        ],
        { session }
      );

      return res.status(201).json({
        success: true,
        message: "Process bill created successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getProcessillById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Process Id Required");
    const ProcessBill = await processBillsModel.findById(id);
    if (!ProcessBill) throw new Error("Process Bill Not Found");
    setMongoose();
    return res.status(200).json(ProcessBill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllProcessBills = async (req, res, next) => {

    try {
      const page = parseInt(req.query.page) || 1;
      let limit = 6;
      let search = req.query.search || "";
      let category = req.query.category || "";
  
      let query = {};
  
      if (category) {
        query.process_Category = category
      };
  
      if (search) {
        query.serial_No = search
      };
  
      const totalProcessBills = await processBillsModel.countDocuments(query);
  
      const processBills = await processBillsModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
  
      const response = {
        processBills,
        page,
        totalProcessBills,
        totalPages: Math.ceil(totalProcessBills / limit)
      };
      
      setMongoose();
  
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

