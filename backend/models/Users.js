import mongoose from "mongoose"
import { Schema, model } from "mongoose"

const userSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  name: {type: String },
  email: { type: String, unique: true },
  password: String,
  phone: String,
  profile: {
    dateOfBirth: {type: String, default: null},
    address: {type: String, default: null},
    aadharNumber: {type: String, default: null},
    landHolding: {type: String, default: null},
    education: {type: String, default: null},
    farmingExperience: {type: String, default: null},
  },
  bank: {
    bankName: {type: String, default: null},
    bankAccount: {type: String, default: null},
    ifscCode: {type: String, default: null}
  },
  documents: [
    {
      docName: {type: String},
      docUrl: {type: String},
      uploadedOn: String,
      Verified: {type: String, default: "Verified"}
    }
  ]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User