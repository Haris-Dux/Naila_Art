import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BaseModel } from "../../models/Stock/Base.Model.js";
import mongoose from "mongoose";
import { setMongoose } from "../../utils/Mongoose.js";
import { addBPair } from "./B_PairController.js";
import { processBillsModel } from "../../models/Process/ProcessBillsModel.js";
import CustomError from "../../config/errors/CustomError.js";

export const addEmbriodery = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        partyName,
        partytype,
        Manual_No,
        date,
        per_suit,
        project_status,
        design_no,
        discountType,
        discount,
        shirt,
        duppata,
        trouser,
        recieved_suit,
        T_Quantity_In_m,
        T_Quantity,
        T_Suit,
        Front_Stitch,
        Bazo_Stitch,
        Gala_Stitch,
        Back_Stitch,
        Pallu_Stitch,
        Trouser_Stitch,
        D_Patch_Stitch,
        F_Patch_Stitch,
        tissue,
      } = req.body;

      const requiredFields = [
        "partyName",
        "Manual_No",
        "partytype",
        "date",
        "per_suit",
        "project_status",
        "design_no",
        "T_Quantity_In_m",
        "T_Quantity",
      ];

      const optionalFields1 = [
        "Front_Stitch",
        "Bazo_Stitch",
        "Gala_Stitch",
        "Back_Stitch",
        "Pallu_Stitch",
        "Trouser_Stitch",
        "D_Patch_Stitch",
        "F_Patch_Stitch",
      ];

      const optionalFields2 = ["shirt", "duppata", "trouser"];
      const valuesForoptionalFields2 = [
        "category",
        "color",
        "quantity_in_m",
        "quantity_in_no",
      ];
      const tissueFields = ["category", "color", "quantity_in_m"];

      const findmissingFields = (data, requiredSubFields) => {
        return data
          .map((item) => {
            const missingData = requiredSubFields.filter(
              (field) => !item[field]
            );
            if (missingData.length > 0) {
              return missingData;
            }
            return null;
          })
          .filter(Boolean);
      };
      const missingFields = [];

      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        }
      });

      optionalFields1.forEach((field) => {
        if (req.body[field]) {
          const { head, value } = req.body[field];
          if (value === null && head === null) {
            return;
          }
          if (!value || !head) {
            missingFields.push(`${field} must have head and value`);
          }
        }
      });

      optionalFields2.forEach((field) => {
        if (req.body[field]) {
          const { category, color, quantity_in_m, quantity_in_no } =
            req.body[field];
          if (
            category === null &&
            color === null &&
            quantity_in_m === null &&
            quantity_in_no === null
          ) {
            return;
          }
          const missing = findmissingFields(
            req.body[field],
            valuesForoptionalFields2
          );
          if (missing.length > 0) {
            missingFields.push(`${field} Data is missing ${missing}`);
          }
        }
      });

      //VALIDATING TISSUE DATA
      if (req.body.tissue) {
        req.body.tissue.forEach((item, index) => {
          const { category, color, quantity_in_m } = item;
          if (category === null && color === null && quantity_in_m === null) {
            return;
          }
          const missing = findmissingFields([item], tissueFields);
          if (missing.length > 0) {
            missingFields.push(
              `Tissue Number ${index + 1} is missing: ${missing}`
            );
          }
        });
      }

      if (missingFields.length > 0) {
        throw new Error(`Missing fields : ${missingFields}`);
      }

      if (!per_suit || isNaN(per_suit) || parseFloat(per_suit) <= 0) {
        throw new Error("Invalid Per Suit value");
      }

      if (partytype === "newParty") {
        const checkExistingEmbroidery = await EmbroideryModel.findOne({
          partyName: { $regex: partyName, $options: "i" },
        }).session(session);
        if (checkExistingEmbroidery) {
          throw new CustomError("Party Name Already In Use", 400);
        }
      }

      // INVENTORY BASE STOCK DEDUCTION THROUGH TRANSACTIONS
      const handleInventory = async (items) => {
        if (items && items.length > 0) {
          await Promise.all(
            items?.map(async (item) => {
              const matchedRecord = await BaseModel.findOne({
                category: item.category,
                colors: item.color,
              }).session(session);
              if (matchedRecord) {
                matchedRecord.TYm -= item.quantity_in_m;
                if (matchedRecord.TYm < 0)
                  throw new Error(
                    `Not Enough Stock for category ${item.category} and color ${item.color}`
                  );
                await matchedRecord.save({ session });
              } else {
                throw new Error(
                  `No Stock Found For category ${item.category} and color ${item.color}`
                );
              }
            })
          );
        }
      };

      await handleInventory(shirt);
      await handleInventory(duppata);
      await handleInventory(trouser);
      await handleInventory(tissue);

      let totalQuantityInMForTissue = 0;
      if (req.body.tissue) {
        totalQuantityInMForTissue = tissue.reduce(
          (sum, item) => sum + item.quantity_in_m,
          0
        );
      }

      const lastDocument = await EmbroideryModel.findOne()
        .sort({ _id: -1 })
        .select("serial_No")
        .session(session);
      const lastSerialNo = lastDocument ? lastDocument.serial_No : 0;

      await EmbroideryModel.create(
        [
          {
            partyName,
            Manual_No,
            date,
            per_suit,
            project_status,
            design_no,
            shirt,
            duppata,
            trouser,
            discountType,
            discount,
            recieved_suit,
            T_Quantity_In_m,
            T_Quantity,
            T_Suit,
            Front_Stitch,
            Bazo_Stitch,
            Gala_Stitch,
            Back_Stitch,
            Pallu_Stitch,
            Trouser_Stitch,
            D_Patch_Stitch,
            F_Patch_Stitch,
            tissue: totalQuantityInMForTissue,
            serial_No: lastSerialNo + 1,
          },
        ],
        { session }
      );
    });

    return res
      .status(200)
      .json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllEmbroidery = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const Manual_No = req.query.Manual_No || "";
    const project_status = req.query.project_status || "";
    const design_no = req.query.design_no || "";
    const partyName = req.query.partyName || "";
    const limit = 40;
    let query = {};

    if (Manual_No) query.Manual_No = Manual_No;
    if (project_status) query.project_status = project_status;
    if (design_no) query.design_no = design_no;
    if (partyName) {
      query.partyName = { $regex: partyName, $options: "i" };
    }

    const data = await EmbroideryModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await EmbroideryModel.countDocuments(query);
    const response = {
      totalPages: Math.ceil(total / limit),
      data,
      page,
    };
    setMongoose();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEmbroideryById = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Id Required");
    const data = await EmbroideryModel.findById(id);

    setMongoose();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateEmbroidery = async (req, res, next) => {
  try {
    const { id, project_status, shirt, duppata, trouser } = req.body;
    if (!id) throw new Error("Emroidery Id Not Found");
    const embroideryData = await EmbroideryModel.findById(id);
    if (!embroideryData) throw new Error("Emroidery Data Not Found");
    if (project_status) {
      if (project_status === "Completed" && embroideryData.updated === true) {
        embroideryData.project_status = project_status;
      } else
        throw new Error(
          "Status cannot be updated.Please Update return quantity first"
        );
    }
    if (shirt) {
      shirt.forEach((item) => {
        const { received, id } = item;
        const shirtItem = embroideryData.shirt.find(
          (s) =>  s._id.toString() === id
        );
        if (shirtItem) {
          shirtItem.received = received;
        }
      });
    }
    if (duppata) {
      duppata.forEach((item) => {
        const { received, id } = item;
        const dupattaItem = embroideryData.duppata.find(
          (d) => d._id.toString() === id
        );
        if (dupattaItem) {
          dupattaItem.received = received;
        }
      });
    }
    if (trouser) {
      trouser.forEach((item) => {
        const { received, id } = item;
        const trouserItem = embroideryData.trouser.find(
          (t) => t._id.toString() === id
        );
        if (trouserItem) {
          trouserItem.received = received;
        }
      });
    }
    if (shirt || duppata || trouser) {
      const checkInvalidValue = (value) => {
        return isNaN(value) || value === undefined || value === null
          ? 0
          : value;
      };
      const calculateTotalRecieved = () => {
        let totalRecieved = 0;
        totalRecieved += shirt.reduce(
          (received, item) => received + checkInvalidValue(item.received),
          0
        );
        totalRecieved += trouser.reduce(
          (received, item) => received + checkInvalidValue(item.received),
          0
        );
        totalRecieved += duppata.reduce(
          (received, item) => received + checkInvalidValue(item.received),
          0
        );
        return totalRecieved;
      };
      const calculateShirtRecieved = () => {
        let suit_Recieved = 0;
        suit_Recieved += shirt.reduce(
          (received, item) => received + checkInvalidValue(item.received),
          0
        );
        return suit_Recieved;
      };
      embroideryData.recieved_suit = calculateTotalRecieved();
      embroideryData.T_Recieved_Suit = calculateShirtRecieved();
      embroideryData.updated = true;
    }
    const quantity = embroideryData.T_Quantity - embroideryData.recieved_suit;
    if (embroideryData.project_status === "Completed" && quantity > 0) {
      const rate = Math.round(quantity * embroideryData.per_suit);
      const data = {
        design_no: embroideryData.design_no,
        serial_No: embroideryData.serial_No,
        partyName: embroideryData.partyName,
        quantity,
        rate,
        b_PairCategory: "Embroidery",
      };
      const response = await addBPair(data);
      if (response.error) throw new Error(response.error);
    }

    await embroideryData.save();
    return res.status(200).json({
      success: true,
      message: "Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllDesignNumbers = async (req, res, next) => {
  try {
    const data = await EmbroideryModel.distinct("design_no");
    if (data.length === 0) throw new Error("No Data found for Design Number");
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHeadDataByDesignNo = async (req, res, next) => {
  try {
    const { design_no } = req.body;
    if (!design_no) throw new Error("No Design Number found");
    const data = await EmbroideryModel.aggregate([
      { $match: { design_no } },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
      {
        $project: {
          partyName: 1,
          design_no: 1,
          Front_Stitch: 1,
          Bazo_Stitch: 1,
          Gala_Stitch: 1,
          Back_Stitch: 1,
          Pallu_Stitch: 1,
          Trouser_Stitch: 1,
          D_Patch_Stitch: 1,
          F_Patch_Stitch: 1,
          shirt: { $arrayElemAt: ["$shirt.category", 0] },
        },
      },
    ]);
    setMongoose();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPreviousDataBypartyName = async (req, res, next) => {
  try {
    const { partyName } = req.body;
    if (!partyName) throw new Error("No Party Name found");
    const Embquery = {
      partyName: { $regex: partyName, $options: "i" },
    };
    const billQuery = {
      partyName: { $regex: partyName, $options: "i" },
      process_Category: "Embroidery",
    };
    let embData = await EmbroideryModel.find(Embquery, ["partyName"]);
    embData = Array.from(
      new Map(embData.map((item) => [item.partyName, item])).values()
    );
    const accountData = await processBillsModel.find(billQuery, [
      "virtual_account",
      "partyName",
    ]);
    const data = {
      embroideryData: embData,
      accountData: accountData,
    };
    setMongoose();
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmbroidery = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id } = req.body;
      if (!id) throw new CustomError("Embroidery Id Required", 404);
      const embroideryData = await EmbroideryModel.findById(id).session(
        session
      );

      if (embroideryData) {
        const trueSteps = Object.entries(embroideryData.next_steps)
          .filter(([step, value]) => value === true)
          .map(([step]) => step);
        if (trueSteps.length > 0) {
          throw new Error(`Cannot Delete Embroidery While ${trueSteps} Found `);
        }
      }

      if (embroideryData.bill_generated === true)
        throw new Error("Cannot Delete Embroidery");

      const addInStock = async (items) => {
        if (items && items.length > 0) {
          await Promise.all(
            items?.map(async (item) => {
              const matchedRecord = await BaseModel.findOne({
                category: item.category,
                colors: item.color,
              }).session(session);
              if (matchedRecord) {
                matchedRecord.TYm += item.quantity_in_m;
                await matchedRecord.save({ session });
              } else {
                throw new Error(
                  `No Stock Found For category ${item.category} and color ${item.color}`
                );
              }
            })
          );
        }
      };

      const processStockUpdate = async (oderData) => {
        const stockItmes = [
          { key: "shirt", items: embroideryData.shirt },
          { key: "trouser", items: embroideryData.trouser },
          { key: "duppata", items: embroideryData.duppata },
        ];
        for (const { key, items } of stockItmes) {
          if (oderData[key]) {
            await addInStock(items);
          }
        }
      };

      await processStockUpdate(embroideryData);

      await EmbroideryModel.findByIdAndDelete(id).session(session);
      res.status(200).json({
        success: true,
        message: "Embroidery deleted successfully",
      });
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};
