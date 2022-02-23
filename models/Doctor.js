import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const isEmail = validator.isEmail;

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter last name"],
  },

  available: {
    type: Boolean,
    default: true,
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
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
});

doctorSchema.methods.toJSON = function () {
  const doctor = this.toObject();
  delete doctor.password;
  return doctor;
};
doctorSchema.pre("save", async function (next) {
  const doctor = this;

  // only hash the password if it has been modified (or is new)
  if (!doctor.isModified("password")) return next();

  const hashPassword = await bcrypt.hash(doctor.password, 12);
  doctor.password = hashPassword;
  next();
});

export const Doctor = mongoose.model("Doctor", doctorSchema);
