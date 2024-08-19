import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BaseModel } from "../../models/Stock/Base.Model.js";
import mongoose from "mongoose";
import { setMongoose } from "../../utils/Mongoose.js";

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
      };

      // INVENTORY DEDUCTION THROUGH TRANSACTIONS
      const handleInventory = async (items) => {
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
    const limit = 5;
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
    };
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
    };
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
    };
    let received_suit = 0;
    const colors = new Set([
      ...shirt?.map(item=>item.color) || [],
      ...trouser?.map(item=>item.color) || [],
      ...duppata?.map(item=>item.color) || [],
    ]);
    colors.forEach((color)=>{
      const shirtItem = shirt.find(item => item.color === color);
      const duppataItem = duppata.find(item => item.color === color);
      const trouserItem = trouser.find(item => item.color === color);
      if (
        shirtItem && duppataItem && trouserItem &&
        shirtItem.received === duppataItem.received &&
        shirtItem.received === trouserItem.received
      ) {
        received_suit += shirtItem.received;
      }
    });
    if(!isNaN(received_suit)){
      embroideryData.recieved_suit = received_suit;
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
