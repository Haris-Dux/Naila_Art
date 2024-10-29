import mongoose from "mongoose";

const shirtSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  quantity_in_no: {
    type: Number,
  },
  quantity_in_m: {
    type: Number,
  },
  received: {
    type: Number,
    default: null,
  },
});

const duppataSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  quantity_in_no: {
    type: Number,
  },
  quantity_in_m: {
    type: Number,
  },
  received: {
    type: Number,
    default: null,
  },
});

const trouserSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  quantity_in_no: {
    type: Number,
  },
  quantity_in_m: {
    type: Number,
  },
  received: {
    type: Number,
    default: null,
  },
});

const stitchSchema = new mongoose.Schema({
  value: {
    type: Number,
  },
  head: {
    type: Number,
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
      default:null
    },
    T_Quantity_In_m: {
      type: Number,
    },
    T_Quantity: {
      type: Number,
    },
    T_Suit: {
      type: Number,
    },
    T_Recieved_Suit: {
      type: Number,
      default:0
    },
    Front_Stitch: {
      type: stitchSchema,
    },
    Bazo_Stitch: {
      type: stitchSchema,
    },
    Gala_Stitch: {
      type: stitchSchema,
    },
    Back_Stitch: {
      type: stitchSchema,
    },
    Pallu_Stitch: {
      type: stitchSchema,
    },
    Trouser_Stitch: {
      type: stitchSchema,
    },
    D_Patch_Stitch: {
      type: stitchSchema,
    },
    F_Patch_Stitch: {
      type: stitchSchema,
    },
    tissue: {
      type: Number,
      required: [true, "Tissue value required"],
    },
    bill_generated : {
      type: Boolean,
      default: false
    },
    updated : {
      type: Boolean,
      default: false
    },
    pictures_Order : {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const EmbroideryModel = mongoose.model("Embroidery", embroiderySchema);
