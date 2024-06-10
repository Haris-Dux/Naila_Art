import mongoose from 'mongoose'

const calenderSchema = new Schema({
  userId: {
    type:mongoose.Types.ObjectId,
     required:[true,"Please Provide User Id"]
  },
  otp: {
    type: Number,
    required:[true,"Please Provide Otp"]
  },

}, { timestamps: true });

export const calenderModel = mongoose.model('Calender', calenderSchema);


