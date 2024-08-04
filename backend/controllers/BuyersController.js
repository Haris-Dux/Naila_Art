import { BranchModel } from "../models/Branch.Model.js";
import { BagsAndBoxModel } from "../models/Stock/BagsAndBoxModel.js";
import { SuitsModel } from "../models/Stock/Suits.Model.js";

export const generateBuyersBillandAddBuyer = async (req, res, next) => {
  try {
    const {
      branchId,
      serialNumber,
      name,
      city,
      cargo,
      phone,
      date,
      bill_by,
      payment_Method,
      packaging,
      discount,
      suits_data,
      total,
      paid,
      remaining,
    } = req.body;
    const requiredFields = [
      "branchId",
      "serialNumber",
      "name",
      "city",
      "cargo",
      "phone",
      "date",
      "bill_by",
      "payment_Method",
      "packaging",
      "discount",
      "suits_data",
      "total",
      "paid",
      "remaining"
    ];
    const missingFields = [];
    requiredFields.forEach((field) => {
     if(!req.body[field]){
      missingFields.push(field);
     }
  });
  if(missingFields.length > 0) throw new Error(`Missing Fields ${missingFields}`);
  const branch = await BranchModel.findOne({ _id: branchId });
    if (!branch) throw new Error("Branch Not Found");

    //DEDUCTING BAGS OR BOXES FROM STOCK
    const bagsorBoxStock = await BagsAndBoxModel.findById(packaging.id);
    if (!bagsorBoxStock) throw new Error("Packaging Not Found");
    const updatedBagsorBoxQuantity = bagsorBoxStock.totalQuantity - parseInt(packaging.quantity);
    if(updatedBagsorBoxQuantity < 0) throw new Error(`Not Enough ${bagsorBoxStock.name} in Stock`)
    bagsorBoxStock.totalQuantity = updatedBagsorBoxQuantity;

    //DEDUCTING SUITS FROM STOCK
    const suitsIdsToDeduct = suits_data.map((suit) => (
      suit.id
    ));
    const suitsStock = await SuitsModel.find({ _id: { $in: suitsIdsToDeduct }});
    console.log(suitsStock);
      


  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
