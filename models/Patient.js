import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const isEmail = validator.isEmail;

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter last name"],
  },
  address: {
    type: String,
    default: "N/A",
  },
  gender: {
    type: String,
    required: [true, "Please enter gender"],
  },
  age: {
    type: Number,
    required: [true, "Please enter gender"],
  },
  height: {
    type: String,
    default: "N/A",
  },
  weight: {
    type: String,
    default: "N/A",
  },
  phoneNumber: {
    type: String,
    required: [
      true,
      "Please enter your phone number so the doctor can stay in contact with you",
    ],
  },

  occupation: {
    type: String,
    default: "N/A",
  },
  medicalHistoryDetails: {
    type: String,
    default: "N/A",
  },
  IP: {
    type: String,
  },
  token: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [(val) => isEmail(val), "Please enter a valid email"],
  },
  password: {
    select: false,
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
});

patientSchema.methods.toJSON = function () {
  const patient = this.toObject();
  delete patient.password;
  return patient;
};

patientSchema.pre("save", async function (next) {
  const patient = this;

  // only hash the password if it has been modified (or is new)
  if (!patient.isModified("password")) return next();

  const hashPassword = await bcrypt.hash(patient.password, 12);
  patient.password = hashPassword;
  next();
});

export const Patient = mongoose.model("Patient", patientSchema);
