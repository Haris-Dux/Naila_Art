import { BranchModel } from "../../models/Branch.Model.js";
import { BuyersModel } from "../../models/BuyersModel.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { UserModel } from "../../models/User.Model.js";

import moment from "moment-timezone";

export const getDashBoardDataForBranch = async (req, res, next) => {
  try {
    const id = req.session.userId;
    if (!id) {
      return res.status(403).send({ message: "Please Login Again" });
    }
    const user = await UserModel.findById({ _id: id });
    const branch = await BranchModel.findById({ _id: user.branchId });
    if (!branch) {
      return res
        .status(404)
        .send({ message: "No branch Data For Authorized User" });
    }

    //RECIEVEABLE AND SALES BY LOCATION DATA
    const buyers = await BuyersModel.find({ branchId: user.branchId });
    let recieveableSum = 0;
    let saleLocationData = [];
    buyers.forEach((buyer) => {
      recieveableSum += buyer.virtual_account.total_balance;
      const verifyCity = saleLocationData.find(
        (item) => item.city.name.toLowerCase() === buyer.city.toLowerCase()
      );
      if (!verifyCity) {
        saleLocationData.push({
          city: {
            name: buyer.city,
            value: 1,
          },
        });
      } else {
        verifyCity.city.value += 1;
      }
    });

    //SALES DATA , BANK DATA AND CASH IN HAND
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      const dailySaleForToday = await DailySaleModel.findOne({
        branchId:user.branchId,
        date: today ,
      });
      if (!dailySaleForToday) {
        throw new Error("Daily sale record not found for This Date");
      };
      //banks data
      const banksData = {
        Meezan_Bank:dailySaleForToday.saleData.cashInMeezanBank,
        JazzCash:dailySaleForToday.saleData.cashInJazzCash,
        EasyPaisa:dailySaleForToday.saleData.cashInEasyPaisa,
      };
      //cash in hand data
      const cashInHandData = dailySaleForToday.saleData.totalCash;

    let dashBoardData = {
      salesBylocation: saleLocationData,
      bankAccountsData: banksData,
      cashInHand: cashInHandData,
      totalSuits: "",
      recieveable: recieveableSum,
      payable: "",
      dailySale: "",
      monthlysale: "",
      grossSale: "",
      grossProfit: "",
    };

    return res.status(200).json(dashBoardData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
