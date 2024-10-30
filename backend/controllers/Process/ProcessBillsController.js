import mongoose from "mongoose";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import generatePDF from "../../utils/GeneratePdf.js";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { CalenderModel } from "../../models/Process/CalenderModel.js";
import { CuttingModel } from "../../models/Process/CuttingModel.js";
import { StoneModel } from "../../models/Process/StoneModel.js";
import { StitchingModel } from "../../models/Process/StitchingModel.js";
import moment from "moment-timezone";

const today = moment.tz("Asia/Karachi").format("YYYY-MM-DD");

export const generateProcessBill = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        process_Category,
        serial_No,
        partyName,
        design_no,
        rate,
        per_suit,
        r_quantity,
        T_Recieved_Suit,
        Embroidery_id,
        Calender_id,
        Cutting_id,
        Stone_id,
        Stitching_id,
      } = req.body;

      const Manual_No = 10;

      // Validate required fields
      if (
        !process_Category ||
        !serial_No ||
        !partyName ||
        !design_no ||
        !Manual_No
      ) {
        throw new Error("Required fields are missing");
      }
      if (process_Category === "Embroidery" && !T_Recieved_Suit) {
        throw new Error("Required fields are missing");
      }
      if (process_Category !== "Embroidery" && !r_quantity) {
        throw new Error("Required fields are missing");
      }

      //AMOUNT TO PAY IN THE BILL
      let amount = 0;
      if (process_Category === "Embroidery") {
        amount = (per_suit * T_Recieved_Suit).toFixed(0);
      } else {
        amount = (rate * r_quantity).toFixed(0);
      }

      if (amount === 0 || amount < 0) throw new Error("Invalid Balance Amount");

      //CHECK IF THE ACCOUNT DATA EXISTS
      const oldAccountData = await processBillsModel
        .findOne({
          process_Category: process_Category,
          partyName: partyName,
        })
        .session(session);

      // IF ACCOUNT DOES NOT EXIST, CREATE A NEW ONE
      if (!oldAccountData) {
        //DATA FOR VIRTUAL ACCOUNT
        const total_credit = amount;
        const total_balance = amount;

        const virtualAccountData = {
          total_credit,
          total_balance,
        };

        //DATA FOR CREDIT DEBIT HISTORY

        const processIds = {
          Embroidery: Embroidery_id,
          Calender: Calender_id,
          Cutting: Cutting_id,
          Stone: Stone_id,
          Stitching: Stitching_id,
        };

        const filrerdId = processIds[process_Category];

        if (!filrerdId) {
          throw new Error("Invalid Process Category");
        }

        const credit_debit_history_details = [
          {
            date: today,
            particular: `S.N:${serial_No}/M.N:${Manual_No}/D.N:${design_no}`,
            credit: amount.toFixed(0),
            balance: amount.toFixed(0),
            orderId: filrerdId,
          },
        ];

        await processBillsModel.create(
          [
            {
              process_Category,
              partyName,
              credit_debit_history: credit_debit_history_details,
              virtual_account: virtualAccountData,
            },
          ],
          { session }
        );

        //UPATING BILL GENERATED VALUE
        switch (true) {
          case process_Category === "Embroidery":
            const embData = await EmbroideryModel.findById(
              Embroidery_id
            ).session(session);
            if (embData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              embData.bill_generated = true;
              await embData.save({ session });
            }
            break;
          case process_Category === "Calender":
            const calenderData = await CalenderModel.findById(
              Calender_id
            ).session(session);
            if (calenderData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              calenderData.bill_generated = true;
              await calenderData.save({ session });
            }
            break;
          case process_Category === "Cutting":
            const cuttingData = await CuttingModel.findById(Cutting_id).session(
              session
            );
            if (cuttingData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              cuttingData.bill_generated = true;
              await cuttingData.save({ session });
            }
            break;
          case process_Category === "Stone":
            const stoneData = await StoneModel.findById(Stone_id).session(
              session
            );
            if (stoneData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              stoneData.bill_generated = true;
              await stoneData.save({ session });
            }
            break;
          case process_Category === "Stitching":
            const stitchingData = await StitchingModel.findById(
              Stitching_id
            ).session(session);
            if (stitchingData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              stitchingData.bill_generated = true;
              await stitchingData.save({ session });
            }
            break;
          default:
            "";
            break;
        }
      }
      //UPDATE THE VIRUAL ACCOUNT AND PUSH CREDIT DEBIT + ORDER HISTORY
      else {
        //DATA FOR VIRTUAL ACCOUNT
        let new_total_credit =
          oldAccountData.virtual_account.total_credit + amount;
        let new_total_debit = oldAccountData.virtual_account.total_debit;
        const new_total_balance =
          oldAccountData.virtual_account.total_balance + amount;
        let new_status = "";

        switch (true) {
          case new_total_balance === 0:
            new_status = "Paid";
            break;
          case new_total_balance === new_total_credit && new_total_debit > 0:
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

        //Creating Virtual Account Data
        const virtualAccountData = {
          total_debit: new_total_debit,
          total_credit: new_total_credit,
          total_balance: new_total_balance,
          status: new_status,
        };

        //DATA FOR CREDIT DEBIT HISTORY
        const processIds = {
          Embroidery: Embroidery_id,
          Calender: Calender_id,
          Cutting: Cutting_id,
          Stone: Stone_id,
          Stitching: Stitching_id,
        };

        const filrerdId = processIds[process_Category];

        if (!filrerdId) {
          throw new Error("Invalid Process Category");
        }

        const credit_debit_history_details = [
          {
            date: today,
            particular: `S.N:${serial_No}/M.N:${Manual_No}/D.N:${design_no}`,
            credit: amount,
            balance: amount,
            orderId: filrerdId,
          },
        ];
        

        //SAVING THE OLD ACCOUNT DATA
        oldAccountData.virtual_account = virtualAccountData,
        oldAccountData.credit_debit_history.push(
          credit_debit_history_details
        );

        await oldAccountData.save({ session });
      
        //UPATING BILL GENERATED VALUE

        switch (true) {
          case process_Category === "Embroidery":
            const embData = await EmbroideryModel.findById(
              Embroidery_id
            ).session(session);
            if (embData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              embData.bill_generated = true;
              await embData.save({ session });
            }
            break;
          case process_Category === "Calender":
            const calenderData = await CalenderModel.findById(
              Calender_id
            ).session(session);
            if (calenderData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              calenderData.bill_generated = true;
              await calenderData.save({ session });
            }
            break;
          case process_Category === "Cutting":
            const cuttingData = await CuttingModel.findById(Cutting_id).session(
              session
            );
            if (cuttingData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              cuttingData.bill_generated = true;
              await cuttingData.save({ session });
            }
            break;
          case process_Category === "Stone":
            const stoneData = await StoneModel.findById(Stone_id).session(
              session
            );
            if (stoneData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              stoneData.bill_generated = true;
              await stoneData.save({ session });
            }
            break;
          case process_Category === "Stitching":
            const stitchingData = await StitchingModel.findById(
              Stitching_id
            ).session(session);
            if (stitchingData.bill_generated === true) {
              throw new Error("Bill has already been generated");
            } else {
              stitchingData.bill_generated = true;
              await stitchingData.save({ session });
            }
            break;
          default:
            "";
            break;
        }
      }

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
    let limit = 20;
    let search = req.query.search || "";
    let category = req.query.category || "";

    let query = {};

    if (category) {
      query.process_Category = category;
    }

    if (search) {
      query.serial_No = search;
    }

    const totalProcessBills = await processBillsModel.countDocuments(query);

    const processBills = await processBillsModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const response = {
      processBills,
      page,
      totalProcessBills,
      totalPages: Math.ceil(totalProcessBills / limit),
    };

    setMongoose();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const generateGatePassPdfFunction = async (req, res, next) => {
  try {
    const { data, category } = req.body;
    let pdfData = {};

    switch (true) {
      case category === "Embroidery":
        const extractEmbroideryDetails = (items) => {
          return (
            items &&
            items.map((item) => {
              const { quantity_in_no, color } = item;
              return { quantity_in_no, color };
            })
          );
        };

        let extractedShirtData = [];
        let extractedDuppataData = [];
        let extractedTrouserData = [];

        extractedShirtData = extractEmbroideryDetails(data.shirt);
        extractedDuppataData = extractEmbroideryDetails(data.duppata);
        extractedTrouserData = extractEmbroideryDetails(data.trouser);

        pdfData = {
          category: category,
          partyName: data.partyName,
          serial_No: data.serial_No,
          date: new Date(data.date).toISOString().split("T")[0],
          design_no: data.design_no,
          shirtData:
            extractedShirtData && extractedShirtData.length > 0
              ? extractedShirtData
              : undefined,
          dupattaData:
            extractedDuppataData && extractedDuppataData.length > 0
              ? extractedDuppataData
              : undefined,
          trouserData:
            extractedTrouserData && extractedTrouserData.length > 0
              ? extractedTrouserData
              : undefined,
        };

        break;

      case category === "Calender" || category === "Cutting":
        pdfData = {
          category: category,
          partyName: data.partyName,
          serial_No: data.serial_No,
          date: new Date(data.date).toISOString().split("T")[0],
          design_no: data.design_no,
          T_Quantity: data.T_Quantity,
        };
        break;

      case category === "Stone":
        const extractCategoryDetails = (items) => {
          return (
            items &&
            items.map((item) => {
              const { category, color, quantity } = item;
              return { category, color, quantity };
            })
          );
        };
        let extractedData = [];
        extractedData = extractCategoryDetails(data.category_quantity);

        pdfData = {
          category: category,
          partyName: data.partyName,
          serial_No: data.serial_No,
          date: new Date(data.date).toISOString().split("T")[0],
          design_no: data.design_no,
          T_Quantity: data.T_Quantity,
          categoryData: extractedData,
        };
        break;
      case category === "Stitching":
        const extractStitchingDetails = (items) => {
          return (
            items &&
            items.map((item) => {
              const { quantity_in_no, color, category } = item;
              return { quantity_in_no, color, category };
            })
          );
        };

        let extractedSuitDataForStitching = [];
        let extractedDuppataDataForStitching = [];

        extractedSuitDataForStitching = extractStitchingDetails(
          data.suits_category
        );
        extractedDuppataDataForStitching = extractStitchingDetails(
          data.dupatta_category
        );

        pdfData = {
          category: category,
          partyName: data.partyName,
          serial_No: data.serial_No,
          date: new Date(data.date).toISOString().split("T")[0],
          design_no: data.design_no,
          T_Quantity: data.Quantity,
          suitData: extractedSuitDataForStitching,
          dupattaData: extractedDuppataDataForStitching,
        };

      default:
        break;
    }

    pdfData = Object.fromEntries(
      Object.entries(pdfData).filter(([_, v]) => v !== undefined)
    );

    const pdfBuffer = await generatePDF(pdfData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdfData.partyName}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.status(200).end(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
