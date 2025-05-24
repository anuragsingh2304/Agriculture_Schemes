import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheme: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  filledInfo: {
    name: String,
    dateOfBirth: String,
    address: String,
    aadharNumber: String,
    landHolding: String,
    education: String,
    income: String,
    farmingExperience: String,
    bankName: String,
    bankAccount: String,
    ifscCode: String
  },
  documents: [Object],
  appliedAt: {
    type: Date,
    default: Date.now
  },
    remark: {
    type: String
  },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // this is going to be Admoin's ID
})

const Application = mongoose.model("Application", applicationSchema)
export default Application