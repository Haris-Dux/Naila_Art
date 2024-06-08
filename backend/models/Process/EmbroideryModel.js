import mongoose from "mongoose";

const shirtSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category value required for shirt"],
  },
  color: {
    type: String,
    required: [true, "Color value required for shirt"],
  },
  quantity_in_no: {
    type: Number,
    required: [true, "Quantity in number value required for shirt"],
  },
  quantity_in_m: {
    type: Number,
    required: [true, "Quantity in meters value required for shirt"],
  },
  received: {
    type: Number,
    default: null,
  },
});

const duppataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category value required for shirt"],
  },
  color: {
    type: String,
    required: [true, "Color value required for shirt"],
  },
  quantity_in_no: {
    type: Number,
    required: [true, "Quantity in number value required for shirt"],
  },
  quantity_in_m: {
    type: Number,
    required: [true, "Quantity in meters value required for shirt"],
  },
  received: {
    type: Number,
    default: null,
  },
});

const trouserSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category value required for shirt"],
  },
  color: {
    type: String,
    required: [true, "Color value required for shirt"],
  },
  quantity_in_no: {
    type: Number,
    required: [true, "Quantity in number value required for shirt"],
  },
  quantity_in_m: {
    type: Number,
    required: [true, "Quantity in meters value required for shirt"],
  },
  received: {
    type: Number,
    default: null,
  },
});

const stitchSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, "Value required"]
  },
  head: {
    type: Number,
    required: [true, "Head value required"]
  }
});

const embroiderySchema = new mongoose.Schema(
  {
    partyName: {
      type: String,
      required: [true, "Party Name required"],
    },
    serial_No: {
      type: Number,
      required: [true, "Serial No required"],
    },
    date: {
      type: Date,
      required: [true, "date required"],
    },
    per_suit: {
      type: Number,
      required: [true, "Per suit value required"],
    },
    project_status: {
      type: String,
      required: [true, "Project status value required"],
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    design_no: {
      type: String,
      required: [true, "Design no value required"],
    },
    shirt: {
      type: [shirtSchema],
      required: [true, "Shirt details required"],
    },
    duppata: {
      type: [duppataSchema],
      required: [true, "Duppata details required"],
    },
    trouser: {
      type: [trouserSchema],
      required: [true, "Trouser details required"],
    },
    recieved_suit: {
      type: Number,
    },
    T_Quantity_In_m: {
      type: Number,
      required: [true, "T_Quantity_In_m value required"],
    },
    T_Quantity: {
      type: Number,
      required: [true, "T_Quantity value required"],
    },
    Front_Stitch: {
      type: stitchSchema,
      required: [true, "Front_Stitch details required"]
    },
    Bazo_Stitch: {
      type: stitchSchema,
      required: [true, "Bazo_Stitch details required"]
    },
    Gala_Stitch: {
      type: stitchSchema,
      required: [true, "Gala_Stitch details required"]
    },
    Back_Stitch: {
      type: stitchSchema,
      required: [true, "Back_Stitch details required"]
    },
    Pallu_Stitch: {
      type: stitchSchema,
      required: [true, "Pallu_Stitch details required"]
    },
    Trouser_Stitch: {
      type: stitchSchema,
      required: [true, "Trouser_Stitch details required"]
    },
    D_Patch_Stitch: {
      type: stitchSchema,
      required: [true, "D_Patch_Stitch details required"]
    },
    F_Patch_Stitch: {
      type: stitchSchema,
      required: [true, "F_Patch_Stitch details required"]
    },
    tissue: {
      type: Number,
      required: [true, "Tissue value required"],
    },
  },
  { timestamps: true }
);

export const EmbroideryModel = mongoose.model("Embroidery", embroiderySchema);
