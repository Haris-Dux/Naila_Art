import { BranchModel } from "../../models/Branch.Model.js";
import { BuyersModel } from "../../models/BuyersModel.js";
import { SellersModel } from "../../models/sellers/SellersModel.js";
import { DailySaleModel } from "../../models/DailySaleModel.js";
import { SuitsModel } from "../../models/Stock/Suits.Model.js";
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

    //daily sale and difference from yesterday
    const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
    const yesterday = moment
      .tz("Asia/Karachi")
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const previousDaySale = await DailySaleModel.findOne({
      branchId: user.branchId,
      date: yesterday,
    });
    const dailySaleForToday = await DailySaleModel.findOne({
      branchId: user.branchId,
      date: today,
    });
    const dailySaleData = {
      today: dailySaleForToday.saleData.totalSale,
      differenceFromYesterday:
        dailySaleForToday.saleData.totalSale -
        previousDaySale.saleData.totalSale,
    };

    //monthly and yearly sale and difference from previous month and year
    const currentMonth = moment.tz("Asia/Karachi").format("YYYY-MM");
    const currentyear = moment.tz("Asia/Karachi").format("YYYY");
    const previousYear = moment
      .tz("Asia/Karachi")
      .subtract(1, "year")
      .format("YYYY");
    const previousMonth = moment
      .tz("Asia/Karachi")
      .subtract(1, "month")
      .format("YYYY-MM");
    const currentMonthAndYearSale = await DailySaleModel.aggregate([
      {
        $match: {
          branchId: user.branchId,
          date: { $regex: `^${currentyear}` },
        },
      },
      {
        $facet: {
          yearlyGrossSale: [
            {
              $group: {
                _id: null,
                totalSale: { $sum: "$saleData.totalSale" },
              },
            },
          ],
          yearlyGrossProfit: [
            {
              $group: {
                _id: null,
                totalProfit: { $sum: "$saleData.totalProfit" },
              },
            },
          ],
          monthlyGrossSale: [
            {
              $match: {
                branchId: user.branchId,
                date: { $regex: `^${currentMonth}` },
              },
            },
            {
              $group: {
                _id: null,
                totalSale: { $sum: "$saleData.totalSale" },
              },
            },
          ],
        },
      },
    ]);

    const previousMonthAndYearlysale = await DailySaleModel.aggregate([
      {
        $facet: {
          yearlyGrossSale: [
            {
              $match: {
                branchId: user.branchId,
                date: { $regex: `^${previousYear}` },
              },
            },
            {
              $group: {
                _id: null,
                totalSale: { $sum: "$saleData.totalSale" },
              },
            },
          ],
          yearlyGrossProfit: [
            {
              $match: {
                branchId: user.branchId,
                date: { $regex: `^${previousYear}` },
              },
            },
            {
              $group: {
                _id: null,
                totalProfit: { $sum: "$saleData.totalProfit" },
              },
            },
          ],
          monthlyGrossSale: [
            {
              $match: {
                branchId: user.branchId,
                date: { $regex: `^${previousMonth}` },
              },
            },
            {
              $group: {
                _id: null,
                totalSale: { $sum: "$saleData.totalSale" },
              },
            },
          ],
        },
      },
    ]);

    //monthly sale data
    const monthlySaleData = {
      currentMonthSale:
        currentMonthAndYearSale[0].monthlyGrossSale[0].totalSale,
      differenceFromLastMonth:
        currentMonthAndYearSale[0].monthlyGrossSale[0].totalSale -
        previousMonthAndYearlysale[0].monthlyGrossSale[0].totalSale,
    };

    //yearly sale data
    const yearlySaleData = {
      currentyearSale: currentMonthAndYearSale[0].yearlyGrossSale[0].totalSale,
      differenceFromLastMonth:
        currentMonthAndYearSale[0].yearlyGrossSale[0].totalSale -
        previousMonthAndYearlysale[0].yearlyGrossSale[0].totalSale,
    };

    //yearly gross profit
    const yearlyGrossProfitData = {
      currentYearGrossProfit:
        currentMonthAndYearSale[0].yearlyGrossProfit[0].totalProfit,
      differenceFromLastyear:
        currentMonthAndYearSale[0].yearlyGrossProfit[0].totalProfit -
        previousMonthAndYearlysale[0].yearlyGrossProfit[0].totalProfit,
    };

    //banks data
    const banksData = {
      Meezan_Bank: dailySaleForToday.saleData.cashInMeezanBank,
      JazzCash: dailySaleForToday.saleData.cashInJazzCash,
      EasyPaisa: dailySaleForToday.saleData.cashInEasyPaisa,
    };

    //cash in hand data
    const cashInHandData = dailySaleForToday.saleData.totalCash;

    //MOTHLY SALES DATA FOR GRAPH
    const salesForEveryMonth = await DailySaleModel.aggregate([
        {
          $match: {
            branchId: user.branchId,
            date: { $regex: `^${currentyear}` } 
          }
        },
        {
          $group: {
            _id: { 
              month: { $substr: ["$date", 5, 2] } 
            },
            totalSale: { $sum: "$saleData.totalSale" } 
          }
        },
        {
          $sort: { 
            "_id.month": 1 
          }
        },
        {
          $project: {
            month: "$_id.month", 
            totalSale: 1,
            _id: 0
          }
        }
      ]);


    //TOTAL SUITS DATA
    const projection = "category quantity color"
    const totalSuitsData = await SuitsModel.find({},projection).sort({createdAt : -1});


    let dashBoardData = {
      salesBylocation: saleLocationData,
      bankAccountsData: banksData,
      cashInHand: cashInHandData,
      totalSuits: totalSuitsData,
      recieveable: recieveableSum,
      dailySale: dailySaleData,
      monthlysale: monthlySaleData,
      grossSale: yearlySaleData,
      grossProfit: yearlyGrossProfitData,
      monthlyGraphData:salesForEveryMonth
    };

    return res.status(200).json(dashBoardData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getDashBoardDataForSuperAdmin = async (req, res, next) => {
    try {
    
      //RECIEVEABLE AND SALES BY LOCATION DATA
  
      const buyers = await BuyersModel.find({ });
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

        //PAYABLE DATA

        const sellers = await SellersModel.find({ });
        let payableSum = 0;
        sellers.forEach((seller) => {  
          payableSum += seller.virtual_account.total_balance;
        });
  
      //SALES DATA , BANK DATA AND CASH IN HAND
  
      //daily sale and difference from yesterday

      const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");
      const yesterday = moment
      .tz("Asia/Karachi")
      .subtract(1, "day")
      .format("YYYY-MM-DD");

      //Today's total sales
      const [todaySalesResult] = await DailySaleModel.aggregate([
        { $match: { date: today } },
      { $facet:{
        totalSale:[ { $group: { _id: null, totalSale: { $sum: "$saleData.totalSale" } } }],
        cashInMeezanBank:[ { $group: { _id: null, cashInMeezanBank: { $sum: "$saleData.cashInMeezanBank" } } }],
        cashInJazzCash:[ { $group: { _id: null, cashInJazzCash: { $sum: "$saleData.cashInJazzCash" } } }],
        cashInEasyPaisa:[ { $group: { _id: null, cashInEasyPaisa: { $sum: "$saleData.cashInEasyPaisa" } } }],
        totalCash:[ { $group: { _id: null, totalCash: { $sum: "$saleData.totalCash" } } }],
       }}
      ]);
    
      //Yesterday's total sales
      const [yesterdaySalesResult] = await DailySaleModel.aggregate([
        { $match: { date: yesterday } },
        { $group: { _id: null, totalSale: { $sum: "$saleData.totalSale" } } }
      ]);

      const dailySaleData = {
        today: todaySalesResult.totalSale[0].totalSale,
        differenceFromYesterday: todaySalesResult.totalSale[0].totalSale - yesterdaySalesResult.totalSale,
      }; 

      //monthly and yearly sale and difference from previous month and year
      const currentMonth = moment.tz("Asia/Karachi").format("YYYY-MM");
      const currentyear = moment.tz("Asia/Karachi").format("YYYY");
      const previousYear = moment
        .tz("Asia/Karachi")
        .subtract(1, "year")
        .format("YYYY");
      const previousMonth = moment
        .tz("Asia/Karachi")
        .subtract(1, "month")
        .format("YYYY-MM");
      const currentMonthAndYearSale = await DailySaleModel.aggregate([
        {
          $match: {
            date: { $regex: `^${currentyear}` },
          },
        },
        {
          $facet: {
            yearlyGrossSale: [
              {
                $group: {
                  _id: null,
                  totalSale: { $sum: "$saleData.totalSale" },
                },
              },
            ],
            yearlyGrossProfit: [
              {
                $group: {
                  _id: null,
                  totalProfit: { $sum: "$saleData.totalProfit" },
                },
              },
            ],
            monthlyGrossSale: [
              {
                $match: {
                  date: { $regex: `^${currentMonth}` },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSale: { $sum: "$saleData.totalSale" },
                },
              },
            ],
          },
        },
      ]);
  
      const previousMonthAndYearlysale = await DailySaleModel.aggregate([
        {
          $facet: {
            yearlyGrossSale: [
              {
                $match: {
                  date: { $regex: `^${previousYear}` },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSale: { $sum: "$saleData.totalSale" },
                },
              },
            ],
            yearlyGrossProfit: [
              {
                $match: {
                  date: { $regex: `^${previousYear}` },
                },
              },
              {
                $group: {
                  _id: null,
                  totalProfit: { $sum: "$saleData.totalProfit" },
                },
              },
            ],
            monthlyGrossSale: [
              {
                $match: {
                  date: { $regex: `^${previousMonth}` },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSale: { $sum: "$saleData.totalSale" },
                },
              },
            ],
          },
        },
      ]);
  
      //monthly sale data
      const monthlySaleData = {
        currentMonthSale:
          currentMonthAndYearSale[0].monthlyGrossSale[0].totalSale,
        differenceFromLastMonth:
          currentMonthAndYearSale[0].monthlyGrossSale[0].totalSale -
          previousMonthAndYearlysale[0].monthlyGrossSale[0].totalSale,
      };
  
      //yearly sale data
      const yearlySaleData = {
        currentyearSale: currentMonthAndYearSale[0].yearlyGrossSale[0].totalSale,
        differenceFromLastYear:
          currentMonthAndYearSale[0].yearlyGrossSale[0].totalSale -
          previousMonthAndYearlysale[0].yearlyGrossSale[0].totalSale,
      };
  
      //yearly gross profit
      const yearlyGrossProfitData = {
        currentYearGrossProfit:
          currentMonthAndYearSale[0].yearlyGrossProfit[0].totalProfit,
        differenceFromLastyear:
          currentMonthAndYearSale[0].yearlyGrossProfit[0].totalProfit -
          previousMonthAndYearlysale[0].yearlyGrossProfit[0].totalProfit,
      };
  
      //banks data
      const banksData = {
        Meezan_Bank: todaySalesResult.cashInMeezanBank[0].cashInMeezanBank,
        JazzCash: todaySalesResult.cashInJazzCash[0].cashInJazzCash,
        EasyPaisa: todaySalesResult.cashInEasyPaisa[0].cashInEasyPaisa,
      };
  
      //cash in hand data
      const cashInHandData = todaySalesResult.totalSale[0].totalCash; 
  
      //MOTHLY SALES DATA FOR GRAPH
      const salesForEveryMonth = await DailySaleModel.aggregate([
          {
            $match: {
              date: { $regex: `^${currentyear}` } 
            }
          },
          {
            $group: {
              _id: { 
                month: { $substr: ["$date", 5, 2] } 
              },
              totalSale: { $sum: "$saleData.totalSale" } 
            }
          },
          {
            $sort: { 
              "_id.month": 1 
            }
          },
          {
            $project: {
              month: "$_id.month", 
              totalSale: 1,
              _id: 0
            }
          }
        ]);
  
      //TOTAL SUITS DATA
      const projection = "category quantity color"
      const totalSuitsData = await SuitsModel.find({},projection).sort({createdAt : -1});
  
  
      let dashBoardData = {
        salesBylocation: saleLocationData,
        bankAccountsData: banksData,
        cashInHand: cashInHandData,
        totalSuits: totalSuitsData,
        recieveable: recieveableSum,
        dailySale: dailySaleData,
        monthlysale: monthlySaleData,
        grossSale: yearlySaleData,
        grossProfit: yearlyGrossProfitData,
        monthlyGraphData:salesForEveryMonth,
        payable:payableSum
      };
  
      return res.status(200).json(dashBoardData);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
