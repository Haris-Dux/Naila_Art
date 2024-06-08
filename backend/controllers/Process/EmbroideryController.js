import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BaseModel } from "../../models/Stock/Base.Model.js";
import mongoose from "mongoose";

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
        "shirt",
        "duppata",
        "trouser",
        "T_Quantity_In_m",
        "T_Quantity",
        "Front_Stitch",
        "Bazo_Stitch",
        "Gala_Stitch",
        "Back_Stitch",
        "Pallu_Stitch",
        "Trouser_Stitch",
        "D_Patch_Stitch",
        "F_Patch_Stitch",
        "tissue",
      ];

      const missingFields = [];
      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        } else if (
          [
            "Front_Stitch",
            "Bazo_Stitch",
            "Gala_Stitch",
            "Back_Stitch",
            "Pallu_Stitch",
            "Trouser_Stitch",
            "D_Patch_Stitch",
            "F_Patch_Stitch",
          ].includes(field) &&
          !req.body[field].head
        ) {
          missingFields.push(`${field}.head`);
        }
      });

      if (missingFields.length > 0) {
        throw new Error(`Missing fields ${missingFields}`);
      }

      // INVENTORY DEDUCTION THROUGH TRANSACTIONS
      const handleInventory = async (items) => {
        await Promise.all(
          items.map(async (item) => {
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

    return res.status(200).json({ success: true, message: "Added Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};


