import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {

    patientId: { type: String, required: true, unique: true, index: true, trim: true },

    firstName: { type: String, required: true, trim: true, index: true },
    lastName:  { type: String, required: true, trim: true, index: true },


    isListed: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);


patientSchema.index({ lastName: 1, firstName: 1 });

export default mongoose.model("Patient", patientSchema);
