import {UserModel} from "../models/User.Model.js";


export const superAdminOnly = async (req, res, next) => {
  const id = req.session.userId;
  if (!id) {
    return res.status(401).json({ message: "Please Login First" });
  }
  const user = await UserModel.findById(id);
  if (user.role !== "superadmin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const superAdminAndAdminOnly = async (req, res, next) => {
  const id = req.session.userId;
  if (!id) {
    return res.status(401).json({ message: "Please Login First" });
  }
  const user = await UserModel.findById(id);
  if (user.role !== "superadmin" && user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

export const verifyUser = async (req, res, next) => {
  const id = req.session.userId;
  if (!id) {
    return res.status(401).json({ message: "Please Login First" });
  }
  const user = await UserModel.findById(id);
  if (!user.authenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
