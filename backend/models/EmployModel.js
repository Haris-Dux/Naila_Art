import mongoose from 'mongoose';

const financeSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:null
      },
    particular:{
        type:String,
        default:null
    },
    balance: {
        type: Number,
        default:null,
      },
    debit: {
        type: Number,
        default:null
      },
    credit: {
        type: Number,
       default:null
      },
});

const employeSchema = new  mongoose.Schema({

  name: {
    type: String, 
    required: [true,"Name required"],
  },
  father_Name: {
    type: String,
    required: [true,"Father Name required"],
  },
  CNIC: {
    type: Number,
    required: [true,"CNIC required"],
  },
  phone_number: {
    type: Number,
    required: [true,"phone number required"],
  },
  address: {
    type: String,
    required: [true,"address required"],
  },
  father_phone_number: {
    type: Number,
    required: [true,"father phone number required"],
  },
  last_work_place: {
    type: String,
    required: [true,"phone number required"],
  },
  designation: {
    type: String,
    required: [true,"designation required"],
  },
  salary: {
    type: Number,
    required: [true,"salary required"],
  },
  joininig_date:{
    type:Date,
    required:[true,"joining date required"]
  },
  financeData:[financeSchema]

}, { timestamps: true });

export const EmployeModel = mongoose.model('Employ', employeSchema);

