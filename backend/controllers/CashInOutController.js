import mongoose from "mongoose";
import { DailySaleModel } from "../models/DailySaleModel.js";
import { BuyersModel } from "../models/BuyersModel.js";
import { SellersModel } from "../models/sellers/SellersModel.js";
import { setMongoose } from "../utils/Mongoose.js";
import { CashInOutModel } from "../models/CashInOutModel.js";
import moment from "moment-timezone";
import corn from "node-cron";
import { BranchModel } from "../models/Branch.Model.js";
import { processBillsModel } from "../models/Process/ProcessBillsModel.js";
import { sendEmail } from "../utils/nodemailer.js";
import { UserModel } from "../models/User.Model.js";
import { PicruresAccountModel } from "../models/Process/PicturesModel.js";
import { virtualAccountsService } from "../services/VirtualAccountsService.js";
import { cashBookService } from "../services/CashbookService.js";
import { getTodayDate } from "../utils/Common.js";

export const validatePartyNameForMainBranch = async (req, res, next) => {
  try {
    const { name, accountCategory } = req.body;
    if (!name || !accountCategory) throw new Error("Search Fields Required");
    const projection = "name phone _id virtual_account";
    const projectionForProcess = "partyName _id serial_No virtual_account";
    let Data = {};

    switch (true) {
      case accountCategory === "Buyers":
        Data = await BuyersModel.find(
          { name: { $regex: name, $options: "i" } },
          projection
        );
        break;
      case accountCategory === "Sellers":
        Data = await SellersModel.find(
          { name: { $regex: name, $options: "i" } },
          projection
        );
        break;
      case accountCategory === "Process Account":
        Data = await processBillsModel.find(
          { partyName: { $regex: name, $options: "i" } },
          projectionForProcess
        );
        break;
      case accountCategory === "Pictures Account":
        Data = await PicruresAccountModel.find(
          { partyName: { $regex: name, $options: "i" } },
          projectionForProcess
        );
        break;
      default:
        throw new Error("Invalid account category");
    }

    if (!Data) throw new Error("No Data Found With For This Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validatePartyNameForAdminBranch = async (req, res, next) => {
  try {
    const { name, accountCategory } = req.body;
    if (!name || !accountCategory) throw new Error("Search Fields Required");
    const id = req.session.userId;
    if (!id) {
      throw new Error("Please Login Again");
    }
    const user = await UserModel.findById({ _id: id });
    if (user.role !== "admin") throw new Error("User UnAuthorized");
    const projection = "name phone _id virtual_account";
    const projectionForProcess = "partyName _id serial_No virtual_account";
    let Data = {};

    switch (true) {
      case accountCategory === "Buyers":
        Data = await BuyersModel.find(
          { branchId: user.branchId, name: { $regex: name, $options: "i" } },
          projection
        );
        break;
      case accountCategory === "Sellers":
        Data = await SellersModel.find(
          { name: { $regex: name, $options: "i" } },
          projection
        );
        break;
      case accountCategory === "Process Account":
        Data = await processBillsModel.find(
          { partyName: { $regex: name, $options: "i" } },
          projectionForProcess
        );
        break;
      case accountCategory === "Pictures Account":
        Data = await PicruresAccountModel.find(
          { partyName: { $regex: name, $options: "i" } },
          projectionForProcess
        );
        break;
      default:
        throw new Error("Invalid account category");
    }

    if (!Data) throw new Error("No Data Found With For This Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const validatePartyNameForOtherBranches = async (req, res, next) => {
  try {
    const id = req.session.userId;
    const { name } = req.body;
    if (!name) throw new Error("Buyer Name Required");
    if (!id) {
      throw new Error("Please Login Again");
    }
    const user = await UserModel.findById({ _id: id });
    const projection = "name phone _id virtual_account";
    const Data = await BuyersModel.find(
      { branchId: user.branchId, name: { $regex: name, $options: "i" } },
      projection
    );
    if (!Data) throw new Error("No Data Found With This Buyer Name");
    setMongoose();
    return res.status(200).json({ success: true, Data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const cashIn = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        cash,
        partyId,
        branchId,
        payment_Method,
        date,
        accountCategory,
        note,
        pastTransaction,
      } = req.body;
      if (
        !cash ||
        !partyId ||
        !payment_Method ||
        !date ||
        !branchId ||
        !accountCategory ||
        !note ||
        pastTransaction === undefined
      )
        throw new Error("All Fields Required");

      //GETTING ACCOUNT CATEGORY DATA
      let userDataToUpdate = {};
      switch (true) {
        case accountCategory === "Buyers":
          userDataToUpdate = await BuyersModel.findById(partyId).session(
            session
          );
          break;
        case accountCategory === "Sellers":
          userDataToUpdate = await SellersModel.findById(partyId).session(
            session
          );
          break;
        case accountCategory === "Process Account":
          userDataToUpdate = await processBillsModel
            .findById(partyId)
            .session(session);
          break;
        case accountCategory === "Pictures Account":
          userDataToUpdate = await PicruresAccountModel.findById(
            partyId
          ).session(session);
          break;
        default:
          throw new Error("Unknown Account Category");
      }

      if (!userDataToUpdate) throw new Error("No Data Found For This Party");

      //DAILY SLAE UPDATE FOR CURRENT DATE
      if (!pastTransaction) {
        const dailySaleForToday = await DailySaleModel.findOne({
          branchId,
          date: { $eq: date },
        }).session(session);
        if (!dailySaleForToday) {
          throw new Error("Daily sale record not found for This Date");
        }

        const updatedSaleData = {
          ...dailySaleForToday.saleData,
          [payment_Method]: (dailySaleForToday.saleData[payment_Method] +=
            cash),
          totalSale: (dailySaleForToday.saleData.totalSale += cash),
          ...(accountCategory === "Buyers" && {
            todayBuyerCredit: (dailySaleForToday.saleData.todayBuyerCredit +=
              cash),
          }),
        };

        if (payment_Method === "cashSale") {
          updatedSaleData.totalCash = dailySaleForToday.saleData.totalCash +=
            cash;
        }

        dailySaleForToday.saleData = updatedSaleData;
        await dailySaleForToday.save({ session });

        //UPDATING CASH IN
        const todayCashInOut = await CashInOutModel.findOne({
          branchId,
          date: { $eq: date },
        }).session(session);
        if (!todayCashInOut) throw new Error("Cash In Out Not Found For Today");
        todayCashInOut.todayCashIn += cash;
        await todayCashInOut.save({ session });
      }

      //DAILY SALE UPDATE FOR PAST DATE
      if (pastTransaction) {
        const dailySaleForPastDate = await DailySaleModel.findOne({
          branchId,
          date: { $eq: date },
        }).session(session);
        if (!dailySaleForPastDate) {
          throw new Error(`Daily sale record not found for ${date}`);
        }

        const updatedSaleData = {
          ...dailySaleForPastDate.saleData,
          [payment_Method]: (dailySaleForPastDate.saleData[payment_Method] +=
            cash),
          totalSale: (dailySaleForPastDate.saleData.totalSale += cash),
          ...(accountCategory === "Buyers" && {
            todayBuyerCredit: (dailySaleForPastDate.saleData.todayBuyerCredit +=
              cash),
          }),
        };

        dailySaleForPastDate.saleData = updatedSaleData;
        await dailySaleForPastDate.save({ session });

        //GET DATES TO UPDATE
        const startDate = moment(date, "YYYY-MM-DD");
        const endDate = getTodayDate();
        let datesToUpdate = [];
        const current = startDate.clone();
        while (current.isSameOrBefore(endDate)) {
          datesToUpdate.push(current.format("YYYY-MM-DD"));
          current.add(1, "day");
        }

        //LOOP THROUGH ALL DATES TILL TODAY TO UPDATE TOTAL CASH
        if (payment_Method === "cashSale") {
          for (const date of datesToUpdate) {
            const dailySale = await DailySaleModel.findOne({
              branchId,
              date: { $eq: date },
            }).session(session);
            if (!dailySale) {
              throw new Error(`Daily sale record not found for ${date}`);
            }
            dailySale.saleData.totalCash += cash;
            await dailySale.save({ session });
          }
        }

        //UPDATING CASH IN
        for (const date of datesToUpdate) {
          const cashInOut = await CashInOutModel.findOne({
            branchId,
            date: { $eq: date },
          }).session(session);
          if (!cashInOut) throw new Error(`Cash In Out Not Found For ${date}`);
          cashInOut.todayCashIn += cash;
          await cashInOut.save({ session });
        }
      }

      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount: cash,
          transactionType: "Deposit",
          date,
          note: `Cash In Transaction For : ${
            userDataToUpdate.partyName || userDataToUpdate.name
          }`,
          ...(pastTransaction && { pastDate: date }),
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      }

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: pastTransaction,
        branchId,
        amount: cash,
        tranSactionType: "Deposit",
        transactionFrom: "Cash In",
        partyName: userDataToUpdate.partyName || userDataToUpdate.name,
        payment_Method,
        session,
        ...(pastTransaction && { pastDate: date }),
      };
      await cashBookService.createCashBookEntry(dataForCashBook);

      if (accountCategory !== "Buyers") {
        //SELLERS , PROCESS , PICTURES CASE
        const new_total_debit = userDataToUpdate.virtual_account.total_debit;
        const new_total_credit =
          userDataToUpdate.virtual_account.total_credit + cash;
        const new_total_balance =
          userDataToUpdate.virtual_account.total_balance + cash;
        let new_status = "";

        //ASSIGN ACCOUNT STATUS
        switch (true) {
          case new_total_balance === 0:
            new_status = "Paid";
            break;
          case new_total_balance === new_total_credit &&
            new_total_debit > 0 &&
            new_total_balance > 0:
            new_status = "Partially Paid";
            break;
          case new_total_debit === 0 && new_total_balance === new_total_credit:
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
          particular: `${payment_Method}/${note}`,
          credit: cash,
          balance: userDataToUpdate.virtual_account.total_balance + cash,
        };

        //UPDATING USER DATA IN DB
        userDataToUpdate.virtual_account = virtualAccountData;
        userDataToUpdate.credit_debit_history.push(
          credit_debit_history_details
        );

        await userDataToUpdate.save({ session });
      }
      //BUYERS CASE
      else {
        //DATA FOR VIRTUAL ACCOUNT
        const new_total_debit =
          userDataToUpdate.virtual_account.total_debit - cash;
        const new_total_credit =
          userDataToUpdate.virtual_account.total_credit + cash;
        const new_total_balance =
          userDataToUpdate.virtual_account.total_balance - cash;
        let new_status = "";

        //ASSIGN ACCOUNT STATUS
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
          particular: `${payment_Method}/${note}`,
          credit: cash,
          balance: userDataToUpdate.virtual_account.total_balance - cash,
        };

        //UPDATING USER DATA IN DB
        userDataToUpdate.virtual_account = virtualAccountData;
        userDataToUpdate.credit_debit_history.push(
          credit_debit_history_details
        );

        await userDataToUpdate.save({ session });
      }

      //Sending Email
      const branch = await BranchModel.findById(branchId)
        .select("branchName")
        .session(session);

      const CashInEmailData = {
        branchName: branch.branchName,
        name: userDataToUpdate.name,
        phone: userDataToUpdate.phone,
        amount: cash,
        date: date,
        payment_Method: payment_Method,
      };

      await sendEmail({
        branchName: branch.branchName,
        email: "offical@nailaarts.com",
        email_Type: "Cash In",
        CashInEmailData,
      });

      return res
        .status(200)
        .json({ sucess: true, message: "Cash In Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const cashOut = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        cash,
        partyId,
        branchId,
        payment_Method,
        date,
        accountCategory,
        note,
        pastTransaction,
      } = req.body;
      if (
        !cash ||
        !partyId ||
        !payment_Method ||
        !date ||
        !branchId ||
        !accountCategory ||
        !note ||
        pastTransaction === undefined
      )
        throw new Error("All Fields Required");
      //GETTING ACCOUNT CATEGORY DATA
      let userDataToUpdate = {};
      switch (true) {
        case accountCategory === "Buyers":
          userDataToUpdate = await BuyersModel.findById(partyId).session(
            session
          );
          break;
        case accountCategory === "Sellers":
          userDataToUpdate = await SellersModel.findById(partyId).session(
            session
          );
          break;
        case accountCategory === "Process Account":
          userDataToUpdate = await processBillsModel
            .findById(partyId)
            .session(session);
          break;
        case accountCategory === "Pictures Account":
          userDataToUpdate = await PicruresAccountModel.findById(
            partyId
          ).session(session);
          break;
        default:
          throw new Error("Unknown Account Category");
      }

      if (!userDataToUpdate) throw new Error("No Data Found Found This Party");

      //DAILY SLAE UPDATE FOR CURRENT DATE
      if (!pastTransaction) {
        const dailySaleForToday = await DailySaleModel.findOne({
          branchId,
          date: { $eq: date },
        }).session(session);

        if (!dailySaleForToday) {
          throw new Error("Daily sale record not found for This Date");
        }

        if (payment_Method === "cashSale") {
          dailySaleForToday.totalCash = dailySaleForToday.saleData.totalCash -=
            cash;
        }

        if (dailySaleForToday.totalCash < 0)
          throw new Error("Not Enough Total Cash");

        await dailySaleForToday.save({ session });

        //UPDATING CASH IN OUT
        const todayCashInOut = await CashInOutModel.findOne({
          branchId,
          date: { $eq: date },
        }).session(session);
        if (!todayCashInOut) throw new Error("Cash In Out Not Found For Today");
        todayCashInOut.todayCashOut += cash;
        await todayCashInOut.save({ session });
      }

      //DAILY SALE UPDATE FOR PAST DATE
      if (pastTransaction) {

        //GET DATES TO UPDATE
        const startDate = moment(date, "YYYY-MM-DD");
        const endDate = getTodayDate();
        let datesToUpdate = [];
        const current = startDate.clone();
        while (current.isSameOrBefore(endDate)) {
          datesToUpdate.push(current.format("YYYY-MM-DD"));
          current.add(1, "day");
        }

        //LOOP THROUGH ALL DATES TILL TODAY TO UPDATE TOTAL CASH
        if (payment_Method === "cashSale") {
          for (const date of datesToUpdate) {
            const dailySale = await DailySaleModel.findOne({
              branchId,
              date: { $eq: date },
            }).session(session);
            if (!dailySale) {
              throw new Error(`Daily sale record not found for ${date}`);
            }
            dailySale.saleData.totalCash -= cash;
            if (dailySale.saleData.totalCash < 0)
              throw new Error(`Not Enough Total Cash For ${date}`);
            await dailySale.save({ session });
          }
        }

        //UPDATING CASH IN
        for (const date of datesToUpdate) {
          //UPDATING CASH IN OUT
          const todayCashInOut = await CashInOutModel.findOne({
            branchId,
            date: { $eq: date },
          }).session(session);
          if (!todayCashInOut)
            throw new Error("Cash In Out Not Found For Today");
          todayCashInOut.todayCashOut += cash;
          await todayCashInOut.save({ session });
        }
      }



      //UPDATING VIRTUAL ACCOUNTS
      if (payment_Method !== "cashSale") {
        const data = {
          session,
          payment_Method,
          amount: cash,
          transactionType: "WithDraw",
          date,
          note: `Cash Out Transaction For : ${
            userDataToUpdate.partyName || userDataToUpdate.name
          }`,
        };
        await virtualAccountsService.makeTransactionInVirtualAccounts(data);
      }

      //PUSH DATA FOR CASH BOOK
      const dataForCashBook = {
        pastTransaction: pastTransaction,
        branchId,
        amount: cash,
        tranSactionType: "WithDraw",
        transactionFrom: "Cash Out",
        partyName: userDataToUpdate.partyName || userDataToUpdate.name,
        payment_Method,
        session,
        ...(pastTransaction && { pastDate: date }),
      };
      await cashBookService.createCashBookEntry(dataForCashBook);

      if (accountCategory === "Buyers") {
        //DATA FOR VIRTUAL ACCOUNT
        const new_total_debit =
          userDataToUpdate.virtual_account.total_debit + cash;
        const new_total_credit = userDataToUpdate.virtual_account.total_credit;
        const new_total_balance =
          userDataToUpdate.virtual_account.total_balance + cash;
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
          particular: `${payment_Method}/${note}`,
          debit: cash,
          balance: userDataToUpdate.virtual_account.total_balance + cash,
        };

        //UPDATING USER DATA IN DB

        userDataToUpdate.virtual_account = virtualAccountData;
        userDataToUpdate.credit_debit_history.push(
          credit_debit_history_details
        );

        await userDataToUpdate.save({ session });
      } else {
        //DATA FOR VIRTUAL ACCOUNT
        const new_total_debit =
          userDataToUpdate.virtual_account.total_debit + cash;
        const new_total_credit =
          userDataToUpdate.virtual_account.total_credit - cash;
        const new_total_balance =
          userDataToUpdate.virtual_account.total_balance - cash;
        let new_status;

        switch (true) {
          case new_total_balance === 0:
            new_status = "Paid";
            break;
          case new_total_balance === new_total_credit &&
            new_total_debit > 0 &&
            new_total_balance > 0:
            new_status = "Partially Paid";
            break;
          case new_total_debit === 0 && new_total_balance === new_total_credit:
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
          particular: `${payment_Method}/${note}`,
          debit: cash,
          balance: userDataToUpdate.virtual_account.total_balance - cash,
        };

        //UPDATING USER DATA IN DB

        userDataToUpdate.virtual_account = virtualAccountData;
        userDataToUpdate.credit_debit_history.push(
          credit_debit_history_details
        );

        await userDataToUpdate.save({ session });
      }

      //SEND EMAIL
      const branch = await BranchModel.findById(branchId)
        .select("branchName")
        .session(session);
      const CashOutEmailData = {
        branchName: branch.branchName,
        name: userDataToUpdate.name,
        phone: userDataToUpdate.phone,
        amount: cash,
        date: date,
        payment_Method: payment_Method,
      };
      await sendEmail({
        email: "offical@nailaarts.com",
        email_Type: "Cash Out",
        CashOutEmailData,
      });

      return res
        .status(200)
        .json({ sucess: true, message: "Cash Out Successfull" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getTodaysCashInOut = async (req, res, next) => {
  try {
    const { branchId } = req.body;
    if (!branchId) throw new Error("Branch Id Not Found");
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
    const projection = "saleData.totalCash";
    const TodaysCashInOut = await CashInOutModel.findOne({
      date: { $eq: today },
      branchId,
    });
    const TodaysDailySale = await DailySaleModel.findOne(
      { date: { $eq: today }, branchId },
      projection
    );

    const data = { ...TodaysCashInOut._doc, ...TodaysDailySale._doc };
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const markAsPaidForBuyers = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id is Required");
    const accountData = await BuyersModel.findById(id);
    if (!accountData) throw new CustomError("Account not found", 404);
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

    //UPDATING ACCOUNT STATUS
    accountData.virtual_account.status = "Paid";

    const historydata = {
      date: today,
      particular: `Account Marked As Paid`,
      credit: accountData.virtual_account.total_balance,
      balance: 0,
      debit: 0,
    };

    //UPDATING ACC CREDIT DEBIT AND BALANCE
    accountData.virtual_account.total_debit = 0;
    accountData.virtual_account.total_credit +=
      accountData.virtual_account.total_balance;
    accountData.virtual_account.total_balance = 0;
    //UPDATING CREDIT DEBIT HISTORY
    accountData.credit_debit_history.push(historydata);
    await accountData.save();
    res.status(200).json({ success: true, message: "Account marked as paid" });
  } catch (error) {
    next(error);
  }
};

corn.schedule(
  "01 00 * * *",
  async () => {
    try {
      const branchData = await BranchModel.find({});
      const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      const dailyCashInOutPromises = branchData?.map(async (branch) => {
        try {
          const verifyDuplicateData = await CashInOutModel.findOne({
            branchId: branch._id,
            date: today,
          });
          if (verifyDuplicateData) {
            console.error(
              `Cash In Out Already Exists for ${branch.branchName} on ${today}`
            );
            return null;
          }
          return await CashInOutModel.create({
            branchId: branch._id,
            date: today,
            todayCashIn: 0,
            todayCashOut: 0,
          });
        } catch (error) {
          console.error(
            `Failed to process branch ${branch.branchName}: ${error.message}`
          );
          return null;
        }
      });
      await Promise.allSettled(dailyCashInOutPromises);
    } catch (error) {
      console.error(`Error in scheduled task: ${error.message}`);
    }
  },
  {
    timezone: "Asia/Karachi",
  }
);
