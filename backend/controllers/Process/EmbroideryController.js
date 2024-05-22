import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";
import { BaseModel } from "../../models/Stock/Base.Model.js";

export const addEmbriodery = async (req, res, next) => {
  try {
    const {
      partyName,
      date,
      per_suit,
      project_statu,
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
      "recieved_suit",
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
      return res.status(400).json({
        error: `Missing fields ${missingFields}`,
      });
    }

    const tissueData = await BaseModel.find(
      { category: tissue.category },
      { colors: tissue.color }
    );

    if (tissueData.length > 0) {
      const updatedTissueTYm = tissueData.TYm - tissue.QuantityInM;
      tissueData.TYm = updatedTissueTYm;
      await tissueData.save();
    };

    const lastDocument = await EmbroideryModel.findOne().sort({ _id: -1 }).select('serial_No');
    const lastSerialNo = lastDocument ? lastDocument.serial_No : 0;
    
    await EmbroideryModel.create({
      partyName,
      date,
      per_suit,
      project_statu,
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
      tissue:tissue.QuantityInM,
      serial_No:lastSerialNo + 1
    });
    return res.status(200).json({success:true,message:"Added Sucessfully"});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
