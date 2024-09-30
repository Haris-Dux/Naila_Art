import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BaseModel } from "../../models/Stock/Base.Model.js";
import mongoose from "mongoose";
import { setMongoose } from "../../utils/Mongoose.js";
import { addBPair } from "./B_PairController.js";

export const addEmbriodery = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const {
        partyName,
        date,
        per_suit,
        project_status,
        design_no,
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
        "date",
        "per_suit",
        "project_status",
        "design_no",
        "T_Quantity_In_m",
        "T_Quantity",
        "tissue",
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

      // INVENTORY DEDUCTION THROUGH TRANSACTIONS
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

      const totalQuantityInMForTissue = tissue.reduce(
        (sum, item) => sum + item.quantity_in_m,
        0
      );

      const lastDocument = await EmbroideryModel.findOne()
        .sort({ _id: -1 })
        .select("serial_No")
        .session(session);
      const lastSerialNo = lastDocument ? lastDocument.serial_No : 0;

      await EmbroideryModel.create(
        [
          {
            partyName,
            date,
            per_suit,
            project_status,
            design_no,
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
    const search = req.query.search || "";
    const limit = 20;
    let query = {
      partyName: { $regex: search, $options: "i" },
    };
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
      embroideryData.project_status = project_status;
    }
    if (shirt) {
      shirt.forEach((item) => {
        const { category, color, received } = item;
        const shirtItem = embroideryData.shirt.find(
          (s) => s.category === category && s.color === color
        );
        if (shirtItem) {
          shirtItem.received = received;
        }
      });
    }
    if (duppata) {
      duppata.forEach((item) => {
        const { category, color, received } = item;
        const dupattaItem = embroideryData.duppata.find(
          (s) => s.category === category && s.color === color
        );
        if (dupattaItem) {
          dupattaItem.received = received;
        }
      });
    }
    if (trouser) {
      trouser.forEach((item) => {
        const { category, color, received } = item;
        const trouserItem = embroideryData.trouser.find(
          (s) => s.category === category && s.color === color
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
      }
      embroideryData.recieved_suit = calculateTotalRecieved();
      embroideryData.T_Recieved_Suit = calculateShirtRecieved();
    };

    if (embroideryData.project_status === "Completed") {
      const quantity = embroideryData.T_Quantity - embroideryData.recieved_suit;
      const rate = quantity * embroideryData.per_suit;
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
