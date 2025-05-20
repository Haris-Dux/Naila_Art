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
  salaryTransaction: {
    type: Boolean,
    default: false,
  },
  reversed: {
    type: Boolean,
    default: false,
  },
  payment_Method: {
    type: String,
    default: "",
  },
  over_time: {
    type: Number,
    default: 0,
  },
  leaves: {
    type: Number,
    default: 0,
  },
  branchId: {
    type: String,
    default: "",
  },
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
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
      6: { type: Number, default: 0 },
      7: { type: Number, default: 0 },
      8: { type: Number, default: 0 },
      9: { type: Number, default: 0 },
      10: { type: Number, default: 0 },
      11: { type: Number, default: 0 },
      12: { type: Number, default: 0 },
    },

    financeData: [financeSchema],
    over_time_history: [
      {
        date: {
          type: String,
          required: [true, "overtime date required"],
        },
        time: {
          type: Number,
          required: [true, "overtime value required"],
        },
        note: {
          type: String,
        },
      },
    ],
    salaryStatus: {
      1: { type: Boolean, default: false },
      2: { type: Boolean, default: false },
      3: { type: Boolean, default: false },
      4: { type: Boolean, default: false },
      5: { type: Boolean, default: false },
      6: { type: Boolean, default: false },
      7: { type: Boolean, default: false },
      8: { type: Boolean, default: false },
      9: { type: Boolean, default: false },
      10: { type: Boolean, default: false },
      11: { type: Boolean, default: false },
      12: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const EmployeModel = mongoose.model("Employ", employeSchema);
