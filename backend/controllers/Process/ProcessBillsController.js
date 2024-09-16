import mongoose from "mongoose";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import { setMongoose } from "../../utils/Mongoose.js";
import generatePDF from "../../utils/GeneratePdf.js";

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
        per_suit,
        r_quantity,
        T_Recieved_Suit
      } = req.body;

      // Validate required fields
      if (
        !process_Category ||
        !serial_No ||
        !partyName ||
        !design_no ||
        !date 
      ) {
        throw new Error("Required fields are missing");
      }
      if (process_Category === "Embroidery"  && !T_Recieved_Suit) {
        throw new Error("Required fields are missing");
      }
      if (process_Category !== "Embroidery" && !r_quantity) {
        throw new Error("Required fields are missing");
      }

      //AMOUNT TO PAY IN THE BILL
      let amount = 0;
      if (process_Category === "Embroidery" ) {
        amount = per_suit * T_Recieved_Suit;
      } else {
        amount = rate * r_quantity;
      }

      if (amount === 0 || amount < 0) throw new Error("Invalid Balance Amount");

      //DATA FOR VIRTUAL ACCOUNT
      const total_credit = amount.toFixed(0);
      const total_balance = amount.toFixed(0);

      const virtualAccountData = {
        total_credit,
        total_balance,
      };

      //DATA FOR CREDIT DEBIT HISTORY
      const credit_debit_history_details = [
        {
          date,
          particular: `Serial No ${serial_No}`,
          credit: amount.toFixed(0),
          balance: amount.toFixed(0),
        },
      ];

      await processBillsModel.create(
        [
          {
            process_Category,
            serial_No,
            partyName,
            design_no,
            date: new Date(date).toISOString().split("T")[0],
            T_Quantity,
            rate: process_Category === "Embroidery" ? per_suit : rate,
            r_quantity:
              process_Category === "Embroidery" ? T_Recieved_Suit : r_quantity,
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
    let limit = 10;
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
              const { category, color , quantity} = item;
              return { category, color ,quantity};
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
          categoryData: extractedData
        };
        break;
        case category === "Stitching":
    
        const extractStitchingDetails = (items) => {
          return (
            items &&
            items.map((item) => {
              const { quantity_in_no, color ,category } = item;
              return { quantity_in_no, color , category };
            })
          );
        };

        let extractedSuitDataForStitching = [];
        let extractedDuppataDataForStitching = [];
       

        extractedSuitDataForStitching = extractStitchingDetails(data.suits_category);
        extractedDuppataDataForStitching = extractStitchingDetails(data.dupatta_category);

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
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
