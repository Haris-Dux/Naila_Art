import mongoose from "mongoose";
import { BranchModel } from "../../models/Branch.Model.js";
import { BuyersBillsModel, BuyersModel } from "../../models/BuyersModel.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { ReturnSuitModel } from "../../models/Returns/ReturnModel.js";
import { setMongoose } from "../../utils/Mongoose.js";

export const createReturn = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // CHECKING FOR REQUIRED FIELDS
      const {
        branchId,
        buyerId,
        bill_Id,
        partyName,
        serialNumber,
        phone,
        date,
        bill_Date,
        T_Return_Amount,
        Amount_From_Balance,
        Amount_From_TotalCash,
        suits_data,
      } = req.body;
      const requiredFields = [
        "branchId",
        "buyerId",
        "bill_Id",
        "partyName",
        "serialNumber",
        "phone",
        "date",
        "bill_Date",
        "T_Return_Amount",
        "Amount_From_Balance",
        "Amount_From_TotalCash",
        "suits_data",
      ];

      const requiredSuitsFields = [
        "id",
        "d_no",
        "color",
        "category",
        "quantity",
        "price",
      ];
      const missingFields = [];

      requiredFields.forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          missingFields.push(field);
        }
        if (field === "suits_data") {
          suits_data.forEach((suit, index) => {
            const missingSuitFields = [];
            requiredSuitsFields.forEach((requiredField) => {
              if (!suit[requiredField]) {
                missingSuitFields.push(requiredField);
              }
            });
            if (missingSuitFields.length > 0) {
              missingFields.push(
                `Suit No ${index + 1} is missing: ${missingSuitFields}`
              );
            }
          });
        }
      });
      if (missingFields.length > 0) {
        throw new Error(`Missing Fields: ${missingFields}`);
      }

      //ADDING RETURN QUANTITY BACK INTO STOCK
      const branch = await BranchModel.findById(branchId).session(session);
      const suitsIds = suits_data.map((suit) => suit.id);
      const suitsStockToUpdate = branch.stockData.filter((mainStock) =>
        suitsIds.some((id) => mainStock.Item_Id.equals(id))
      );
      suitsStockToUpdate.forEach((suit) => {
        const suitToUpdate = suits_data.find((item) => item.id == suit.Item_Id);
        const updatedSuitQuantity = suit.quantity + suitToUpdate.quantity;
        suit.quantity = updatedSuitQuantity;
        return suit;
      });
      await branch.save({ session });

      //GETTING DAILY SALE FOR CURRENT DAY
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId,
        date: date,
      }).session(session);
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for Today");
      }

      //GET BUYER DETAILS
      const buyer = await BuyersModel.findById(buyerId).session(session);
      if (buyer.virtual_account.status !== "Paid") {
        //DATA FOR VIRTUAL ACCOUNT
        const new_total_debit =
          buyer.virtual_account.total_debit - Amount_From_Balance;
        const new_total_credit =
          buyer.virtual_account.total_credit + Amount_From_Balance;
        const new_total_balance =
          buyer.virtual_account.total_balance - Amount_From_Balance;
        let new_status = "";

        switch (true) {
          case new_total_balance === 0:
            new_status = "Paid";
            break;
          case new_total_balance === new_total_debit && new_total_credit > 0:
            new_status = "Partially Paid";
            break;
          case new_total_credit === 0 && new_total_balance === new_total_debit:
            new_status = "Unpaid";
            break;
        }

        if (new_total_balance < 0)
          throw new Error("Invalid Balance Amount For This Party");

        const virtualAccountData = {
          total_debit: new_total_debit,
          total_credit: new_total_credit,
          total_balance: new_total_balance,
          status: new_status,
        };

        //DATA FOR CREDIT DEBIT HISTORY
        const credit_debit_history_details = {
          date: date,
          particular: "Return Payment",
          credit: Amount_From_Balance,
          balance: buyer.virtual_account.total_balance - Amount_From_Balance,
        };

        //UPDATING Buyer DATA IN DB
        buyer.virtual_account = virtualAccountData;
        buyer.credit_debit_history.push(credit_debit_history_details);
        await buyer.save({ session });
      }

      //DEDUCTING TOTAL PROFIT FROM SALE DAY
      const dailySaleForSaleDay = await DailySaleModel.findOne({
        branchId,
        date: bill_Date,
      }).session(session);

      if (!dailySaleForSaleDay) {
        throw new Error("Daily sale record not found for Sale Day");
      }
      const buyerBill = await BuyersBillsModel.findById(bill_Id);
      let profitToDeduct = 0;
      suits_data.forEach((suit) => {
        buyerBill.profitDataForHistory.forEach((record) => {
          if (record.suitId === suit.id) {
            const amount = record.profit * suit.quantity;
            profitToDeduct += amount;
          }
        });
      });
      dailySaleForSaleDay.saleData.totalProfit -= profitToDeduct;
      dailySaleForSaleDay.saleData.totalSale -= T_Return_Amount;
      if (dailySaleForSaleDay.saleData.totalProfit < 0) {
        throw new Error(
          `Invalid Return Request.Total Profit for ${bill_Date} cannot be less then 0`
        );
      } else if (dailySaleForSaleDay.saleData.totalSale < 0) {
        throw new Error(
          `Invalid Return Request.Total Sale for ${bill_Date} cannot be less then 0`
        );
      }
      await dailySaleForSaleDay.save({ session });

      //DEDEUCTION FROM TOTAL CASH IN DAILY SALE
      if (Amount_From_TotalCash > 0) {
        dailySaleForToday.saleData.totalCash -= Amount_From_TotalCash;
        if (dailySaleForToday.saleData.totalCash < 0) {
          throw new Error("Not Enough Total Cash");
        }
        await dailySaleForToday.save({ session });
      }

      //CREATING RETURN SUIT  BILL
      await ReturnSuitModel.create(
        [
          {
            branchId,
            buyerId,
            bill_Id,
            partyName,
            serialNumber,
            phone,
            date,
            bill_Date,
            T_Return_Amount,
            Amount_From_Balance,
            Amount_From_TotalCash,
            suits_data,
          },
        ],
        { session }
      );

      return res
        .status(200)
        .json({ success: true, message: "Return Successfull" });
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllReturnsForBranch = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Branch Id Required Found");
    const name = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    const limit = 20;
    let query = {
      branchId: id,
    };
    if (name) {
      query = { ...query, partyName: { $regex: name, $options: "i" } };
    }

    const totalDocuments = await ReturnSuitModel.countDocuments(query);
    const data = await ReturnSuitModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const response = {
      data,
      page,
      totalPages: Math.ceil(totalDocuments / limit),
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
