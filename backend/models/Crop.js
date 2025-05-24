import mongoose from "mongoose"

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, required: true },
  pesticides: { type: String },
  fertilizers: { type: String },
  imageUrl: { type: String },
  cropType: { type: String },
  waterRequirement: { type: String },
  soilType: { type: String },
  growthDuration: { type: String },
  averageYield: { type: String },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // admin ID
}, { timestamps: true })

const Crop = mongoose.model("Crop", cropSchema)
export default Crop