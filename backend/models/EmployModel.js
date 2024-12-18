import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
  date: {
    type: String,
    default: null,
  },
  particular: {
    type: String,
    default: null,
  },
  balance: {
    type: Number,
    default: null,
  },
  debit: {
    type: Number,
    default: null,
  },
  credit: {
    type: Number,
    default: null,
  },
  salaryTransaction:{
    type:Boolean,
    default: false,
  },
  reversed:{
    type: Boolean,
    default: false,
  },
  payment_Method:{
    type: String,
    default: "",
  },
  over_time:{
    type: Number,
    default: 0,
  },
  leaves:{
    type: Number,
    default: 0,
  },
  branchId:{
    type: String,
    default:""
  }
});

const employeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
    },
    father_Name: {
      type: String,
      required: [true, "Father Name required"],
    },
    CNIC: {
      type: String,
      required: [true, "CNIC required"],
    },
    phone_number: {
      type: Number,
      required: [true, "phone number required"],
    },
    address: {
      type: String,
      required: [true, "address required"],
    },
    father_phone_number: {
      type: Number,
      required: [true, "father phone number required"],
    },
    last_work_place: {
      type: String,
      required: [true, "phone number required"],
    },
    designation: {
      type: String,
      required: [true, "designation required"],
    },
    salary: {
      type: Number,
      required: [true, "salary required"],
    },
    joininig_date: {
      type: String,
      required: [true, "joining date required"],
    },
    pastEmploye: {
      type: Boolean,
      default: false,
    },
    leaves: [],
    overtime_Data: {
        month: {
          type: String,
          default:""
        },
        hours: {
          type: Number,
          default: 0
        },
      }
    ,
    financeData: [financeSchema],
    over_time_history: [{
      date:{
        type:String,
        required:[true, "overtime date required"],
      },
      time:{
        type:Number,
        required:[true, "overtime value required"],
      },
      note:{
        type:String,
        // required:[true, "overtime note is required"],
      }
    }]
  },
  { timestamps: true }
);

export const EmployeModel = mongoose.model("Employ", employeSchema);
