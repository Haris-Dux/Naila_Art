import {
  PicruresAccountModel,
  PicruresModel,
} from "../../models/Process/PicturesModel.js";
import { verifyrequiredparams } from "../../middleware/Common.js";
import CustomError from "../../config/errors/CustomError.js";
import mongoose from "mongoose";
import { EmbroideryModel } from "../../models/Process/EmbroideryModel.js";

// Create a new picture document
export const createPictureOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const {
        embroidery_Id,
        T_Quantity,
        design_no,
        date,
        partyName,
        rate,
        partyType,
        accountId,
      } = req.body;

      await verifyrequiredparams(req.body, [
        "embroidery_Id",
        "T_Quantity",
        "design_no",
        "date",
        "partyName",
        "rate",
        "partyType",
      ]);

      //update embroidery for pictures order
      await EmbroideryModel.findByIdAndUpdate(embroidery_Id,{pictures_Order : true}).session(session);

      if (partyType === "newParty") {
        // Create the new picture Order
        const newPictureOrder = await PicruresModel.create(
          [
            {
              embroidery_Id,
              T_Quantity,
              design_no,
              date,
              partyName,
              rate,
            },
          ],
          { session }
        );

        //DATA FOR VIRTUAL ACCOUNT
        const total_credit = rate;
        const total_balance = rate;
        let status = "Unpaid";

        const virtualAccountData = {
          total_credit,
          total_balance,
          status,
        };
        //DATA FOR CREDIT DEBIT HISTORY
        const credit_debit_history_details = [
          {
            date,
            particular: `New Bill For D.NO : ${design_no}`,
            credit: rate,
            balance: rate,
            orderId: newPictureOrder[0]._id,
          },
        ];

        //Create Account Data
        await PicruresAccountModel.create(
          [
            {
              partyName: partyName,
              virtual_account: virtualAccountData,
              credit_debit_history: credit_debit_history_details,
            },
          ],
          { session }
        );
      } else if (partyType === "oldParty") {
        // Create the new picture Order
        const newPictureOrder = await PicruresModel.create(
          [
            {
              embroidery_Id,
              T_Quantity,
              design_no,
              date,
              partyName,
              rate,
            },
          ],
          { session }
        );

        //GETTING OLD SELLER DATA
        const oldAccountData = await PicruresAccountModel.findById(accountId);

        //DATA FOR VIRTUAL ACCOUNT
        let new_total_credit =
          oldAccountData.virtual_account.total_credit + rate;
        let new_total_debit = oldAccountData.virtual_account.total_debit;
        const new_total_balance =
          oldAccountData.virtual_account.total_balance + rate;
        let new_status = "";

        switch (true) {
          case new_total_balance === 0:
            new_status = "Paid";
            break;
          case new_total_balance === new_total_credit && new_total_debit > 0:
            new_status = "Partially Paid";
            break;
          case new_total_debit === 0 && new_total_balance === new_total_credit:
            new_status = "Unpaid";
            break;
          case new_total_balance < 0:
            new_status = "Advance Paid";
            break;
          default:
            new_status = "";
        }

        //Creating Virtual Account Data
        const virtualAccountData = {
          total_debit: new_total_debit,
          total_credit: new_total_credit,
          total_balance: new_total_balance,
          status: new_status,
        };

        //DATA FOR CREDIT DEBIT HISTORY
        const credit_debit_history_details = {
          date,
          particular: `New Bill For D.NO : ${design_no}`,
          credit: rate,
          balance: new_total_balance,
          orderId: newPictureOrder[0]._id,
        };

        (oldAccountData.virtual_account = virtualAccountData),
          oldAccountData.credit_debit_history.push(
            credit_debit_history_details
          );

        await oldAccountData.save({ session });
      }

      res
        .status(201)
        .json({ success: true, message: "Picture Order Creates Successfully" });
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

// Get a single picture by ID
export const getPictureOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new CustomError("Picture Order Id is required", 404);
    const picture = await PicruresModel.findById(id);
    if (!picture) throw new CustomError("Picture not found", 404);

    res.status(200).json(picture);
  } catch (error) {
    next(error);
  }
};

// Delete a picture Order by ID
export const deletePictureOrderById = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { id } = req.body;
      if (!id) throw new CustomError("Picture Order Id is required", 404);
      const pictureOrder = await PicruresModel.findById(id).session(session);
      if (!pictureOrder) throw new CustomError("Picture not found", 404);
      if (pictureOrder.status === "Completed")
        throw new CustomError("Cannot Delete A Completed Order");
      //GETTING ACCOUNT DATA
      const oldAccountData = await PicruresAccountModel.findOne({}).session(
        session
      );
      //UPDATING ACCOUNT DATA
      const amountToDeduct = pictureOrder.rate;

      //DATA FOR VIRTUAL ACCOUNT
      const new_total_credit =
        oldAccountData.virtual_account.total_credit - amountToDeduct;
      const new_total_debit = oldAccountData.virtual_account.total_debit;
      const new_total_balance =
        oldAccountData.virtual_account.total_balance - amountToDeduct;
      let new_status = "";

      switch (true) {
        case new_total_balance === 0:
          new_status = "Paid";
          break;
        case new_total_balance === new_total_credit &&
          new_total_debit > 0 &&
          new_total_balance > 0:
          new_status = "Partially Paid";
          break;
        case new_total_debit === 0 && new_total_balance === new_total_credit:
          new_status = "Unpaid";
          break;
        case new_total_balance < 0:
          new_status = "Advance Paid";
          break;
        default:
          new_status = "";
      }

      //Creating Virtual Account Data
      const virtualAccountData = {
        total_credit: new_total_credit,
        total_debit: new_total_debit,
        total_balance: new_total_balance,
        status: new_status,
      };
    //   const ObjectId = new mongoose.Types.ObjectId(id);
      (oldAccountData.virtual_account = virtualAccountData),
      oldAccountData.credit_debit_history.forEach((item) => {
        if (item.orderId === id) {
          item.orderId = "";
          item.particular = `Deleted Bill For D.NO : ${pictureOrder.design_no}`;
        }
      });


        await oldAccountData.save({ session });
      await PicruresModel.findByIdAndDelete(id).session(session);
      res
        .status(200)
        .json({ success: true, message: "Picture deleted successfully" });
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

// Update a picture by ID
export const updatePictureOrderById = async (req, res) => {
  try {
    const { id, status } = req.body;
    await verifyrequiredparams(req.body, ["id", "status"]);
    const updateData = {
      status: status,
    };
    const updatedPicture = await PicruresModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ success: true, data: updatedPicture });
  } catch (error) {
    next(error);
  }
};

// Get all picture orders
export const getAllPictureAccounts = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const limit = 20;
    let query = {
      partyName: { $regex: search, $options: "i" },
    };
    const data = await PicruresAccountModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await PicruresAccountModel.countDocuments(query);
    const response = {
      totalPages: Math.ceil(total / limit),
      data,
      page,
    };
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const searchAccountByPartyName = async (req,res,next) => {
    try {
        const { partyName } = req.body;
        if (!partyName) throw new CustomError("No Party Name found",404);
        const billQuery = {
          partyName: { $regex: partyName, $options: "i" },
        }
        const accountData = await PicruresAccountModel.find(billQuery, [
          "virtual_account","partyName"
        ]);
          return res.status(200).send(accountData);
      } catch (error) {
        next(error)
      }
}
