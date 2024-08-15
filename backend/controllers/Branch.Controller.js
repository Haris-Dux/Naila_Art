import { BranchModel } from "../models/Branch.Model.js";
import { UserModel } from "../models/User.Model.js";

export const createBranch = async (req, res) => {
  try {
    const { branchName } = req.body;
    if (!branchName) throw new Error("Invalid branch name");
    const existingBranch = await BranchModel.findOne({
      branchName:{$regex:new $RegExp(branchName)},
    });
    if (existingBranch) {
      throw new Error("This branch already exists");
    }
    await BranchModel.create({ branchName });
    return res.status(201).json({success:true, message: "Success" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { branchName, branchId } = req.body;
    if (!branchName || !branchId) throw new Error("Invalid Update Data");
    const foundBranch = BranchModel.findById(branchId);
    if (!foundBranch) throw new Error("Invalid Branch Id");
    const existingBranch = await BranchModel.findOne({
      branchName,
    });
    if (existingBranch && existingBranch._id !== branchId) {
      throw new Error("This branch already exists");
    }
    await BranchModel.findByIdAndUpdate(
      { _id: branchId },
      { branchName: branchName }
    );
    return res.status(201).json({success:true, message: "updated successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.body;
    if (!branchId) throw new Error("Invalid branch ID");
    await BranchModel.findByIdAndDelete(branchId);
    return res.status(201).json({ success:true,message: "deleted successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("User Id Required")
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User Not Found");
    let response;
    if (user?.role === "superadmin") {
     const branches = await BranchModel.find({});
      response = branches
    } else {
      const branch = await BranchModel.findOne({_id:user.branchId});
      response = [branch];
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

