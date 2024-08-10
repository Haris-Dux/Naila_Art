import { BranchModel } from "../models/Branch.Model.js";
import { UserModel } from "../models/User.Model.js";


export const cashIn = async (req,res,next) => {
    try {
        const {cash,partyId,paymentMethod,date} = req.body;
        const id = req.session.userId;
        const user = await UserModel.findById(id);
        const branchData = await BranchModel.findById(user.branchId);

        return res.status(200).json({sucess:true,message:"Cash In Successfull"});
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
};


export const validateAndGetOldBuyerData = async (req,res,next) => {
    try {
      const {name} = req.body;
      if(!name) throw new Error('Buyer Name Required');
      const oldBuyerData = await BuyersModel.find({name:{$regex:name,$options:'i'}});
      if(!oldBuyerData) throw new Error('No Data Found With This Buyer Name');
      setMongoose();
      return res.status(200).json({success:true,oldBuyerData});
    } catch (error) {
      return res.status(500).json({error:error.message});
    }
  };
  