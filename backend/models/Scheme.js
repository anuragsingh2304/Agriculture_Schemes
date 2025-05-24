import mongoose from "mongoose"

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  eligibility: { type: String },
  benefits: { type: String },
  documents: [{ type: String }], 
  s: { type: String },
  schemeType: {
    type: String,
    enum: ["central", "state", "ngo", "international"],
    default: "state"
  },
  state: { type: String },
  fundingSource: { type: String },
  implementingAgency: { type: String },
  targetGroup: { type: String },
  applicationDeadline: { type: String },

  // 👇 Additional fields
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who added the scheme
}, { timestamps: true })

const Scheme = mongoose.model("Scheme", schemeSchema)
export default Scheme