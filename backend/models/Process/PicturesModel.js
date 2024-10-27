

import mongoose from 'mongoose';

const picturesSchema = new mongoose.Schema({
    embroidery_Id:{
        type: mongoose.Types.ObjectId,
        required: [true, "Embroidery Id required"],
        ref:'Embroidery'
      },
      T_Quantity: {
        type: Number,
      },
      design_no: {
        type: String,
        required: [true, "Design no value required"],
      },
      date: {
        type: String,
        required: [true, "date required"],
      },
      partyName: {
        type: String,
        required: [true, "Party Name required"],
      },
      rate: {
        type: Number,
        required: [true, "Rate value required"],
      },
      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      }
}, { timestamps: true });

export const PicruresModel = mongoose.model('EMB Pictures', picturesSchema);


                           