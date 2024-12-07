import mongoose from "mongoose";
import CustomError from "../../config/errors/CustomError.js";
import { verifyrequiredparams } from "../../middleware/Common.js";
import { CheckModel } from "../../models/Checks/CheckModel.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { VirtalAccountModal } from "../../models/DashboardData/VirtalAccountsModal.js";
import { BuyersModel } from "../../models/BuyersModel.js";
import { sendEmail } from "../../utils/nodemailer.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const addBuyerCheck = async (req, res, next) => {
  try {
    const {buyerId, checkAmount, checkNumber, date, note } =
      req.body;
    await verifyrequiredparams(req.body, [
      "buyerId",
      "checkAmount",
      "checkNumber",
      "date",
      "note",
    ]);
    const checkData = {
      checkNumber,
      checkAmount,
      date,
      note,
    };
    //DIPLICATE CHECK
    const duplicateCheck = await CheckModel.findOne({buyerId:buyerId});
    if (duplicateCheck) {
      duplicateCheck.checkDetails.push(checkData);
      await duplicateCheck.save();
    } else {
      await CheckModel.create({
        buyerId,
        checkDetails: [checkData],
      });
    }

    res.status(201).json({success:true, message: "Check added successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateBuyerCheckWithNew = async (req, res, next) => {
  try {
    const { id, checkId, checkNumber, checkAmount, note, date } = req.body;
    await verifyrequiredparams(req.body, [
      "id",
      "checkId",
      "checkNumber",
      "checkAmount",
      "note",
      "date",
    ]);
    //GET CHECK DATA
    const checkData = await CheckModel.findById(id);
    if (!checkData) {
      throw new CustomError("Check Data Not Found", 404);
    }

    //UPDATE CHECK
    const toUpdate = checkData.checkDetails.find((item) => item._id == checkId);
    if (!toUpdate) {
      throw new CustomError("Check Detail Not Found", 404);
    }
    toUpdate.updated = true;
    //NEW CHECK DATA
    const data = {
      checkNumber,
      checkAmount,
      date,
      note,
      newCheck:false
    };
    //SAVE CHECK DETAILS
    checkData.checkDetails.push(data);
    await checkData.save();
    res.status(200).json({success:true, message: "New Check added successfully" });
  } catch (error) {
    next(error);
  }
};

export const markCheckAsPaid = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id, checkId, date, payment_Method } = req.body;
      await verifyrequiredparams(req.body, [
        "id",
        "checkId",
        "date",
        "payment_Method",
      ]);
      //GET CHECK DATA
      const checkData = await CheckModel.findById(id).session(session);
      if (!checkData) {
        throw new CustomError("Check Not Found", 404);
      }
      //VERIFY IF CHECK IS PAID
      if (checkData.status === "Paid") {
        throw new CustomError("Check is already paid", 400);
      }
      //UPDATE CHECK
      checkData.status = "Paid";
      checkData.paidAmount = checkData.totalAmount;
      const toUpdate = checkData.checkDetails.find(
        (item) => item._id == checkId
      );
      if (!toUpdate) {
        throw new CustomError("Check Detail Not Found", 404);
      }
      toUpdate.paid = true;
      await checkData.save({ session });

      //GET BUYER DATA 
      const userDataToUpdate = await BuyersModel.findById(checkData.buyerId);
      if (!userDataToUpdate) {
        throw new CustomError("Buyer Data Not Found", 404);
      };

      //UPDATE DAILY SALE
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId:userDataToUpdate.branchId,
        date,
      }).session(session);
      if (!dailySaleForToday) {
        throw new CustomError("Daily sale record not found for This Date", 404);
      }

      const updatedSaleData = {
        ...dailySaleForToday.saleData,
        payment_Method: (dailySaleForToday.saleData[payment_Method] +=
          toUpdate.checkAmount),
        totalSale: (dailySaleForToday.saleData.totalSale +=
          toUpdate.checkAmount),
        todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit +=
          toUpdate.checkAmount),
      };

      if (payment_Method === "cashSale") {
        updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
          toUpdate.checkAmount;
      }

      dailySaleForToday.saleData = updatedSaleData;
      await dailySaleForToday.save({ session });

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        let virtualAccounts = await VirtalAccountModal.find({})
          .select("-Transaction_History")
          .session(session);
        let updatedAccount = {
          ...virtualAccounts,
          [payment_Method]: (virtualAccounts[0][payment_Method] +=
            toUpdate.checkAmount),
        };
        virtualAccounts = updatedAccount;
        await virtualAccounts[0].save({ session });
      }

      //UPDATING BUYER ACCOUNT

      const new_total_debit =
        userDataToUpdate.virtual_account.total_debit + toUpdate.checkAmount;
      const new_total_credit = userDataToUpdate.virtual_account.total_credit;
      const new_total_balance =
        userDataToUpdate.virtual_account.total_balance + toUpdate.checkAmount;
      let new_status;

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_debit &&
          new_total_credit > 0 &&
          new_total_balance > 0:
          new_status = "Partially Paid";
          break;
        case new_total_credit === 0 && new_total_balance === new_total_debit:
          new_status = "Unpaid";
          break;
        case new_total_balance < 0:
          new_status = "Advance Paid";
          break;
        default:
          new_status = "";
      }

      const virtualAccountData = {
        total_debit: new_total_debit,
        total_credit: new_total_credit,
        total_balance: new_total_balance,
        status: new_status,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const credit_debit_history_details = {
        date,
        particular: `Check Cashed P.M/${payment_Method}`,
        debit: toUpdate.checkAmount,
        balance:
          userDataToUpdate.virtual_account.total_balance + toUpdate.checkAmount,
      };

      //UPDATING USER DATA IN DB
      userDataToUpdate.virtual_account = virtualAccountData;
      userDataToUpdate.credit_debit_history.push(credit_debit_history_details);

      await userDataToUpdate.save({ session });

      //SEND EMAIL FOR CHECK
      const checkPaidEmailData = {
        name: checkData.partyName,
        amount: toUpdate.checkAmount,
        date: date,
        payment_Method: payment_Method,
      };
      await sendEmail({
        email: "offical@nailaarts.com",
        email_Type: "Check Paid",
        checkPaidEmailData,
      });
      return res.status(200).json({success:true, message: "Check marked as paid successfully" });
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const getAllChecksForParty = async (req,res,next) => {
    try {
        const {buyerId} = req.body;
        await verifyrequiredparams(req.body, ["buyerId"]);
        //GET CHECK DATA
        const checkData = await CheckModel.findOne({buyerId:buyerId});
        if(!checkData) {
            throw new CustomError("Check Data Not Found", 404);
    };
    setMongoose();
    res.status(200).json(checkData);
    } catch (error) {
        next(error);
    }
}

export const deleteCheck = async (req, res, next) => {
  try {
    const { id, checkId } = req.body;
    await verifyrequiredparams(req.body, ["checkId","id"]);
    //GET CHECK DATA
    const checkData = await CheckModel.findById(id);
    if (!checkData) {
      throw new CustomError("Check Data Not Found", 404);
    };

    //DELETE CHECK DETAILS
    const toDelete = checkData.checkDetails.find((item) => item._id == checkId);
    if (!toDelete) {
      throw new CustomError("Check Detail Not Found", 404);
    };
    if (toDelete.updated || toDelete.paid) {
      throw new CustomError("Check cannot be deleted", 400);
    };
    //UPDATE DETAILS 
    
  } catch (error) {
    next(error);
  }
};
