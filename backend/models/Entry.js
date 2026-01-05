import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {

    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    type: { type: String, default: "note", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Entry", entrySchema);
