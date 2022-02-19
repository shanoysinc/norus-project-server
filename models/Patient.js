// const mongoose = require("mongoose");
// const { isEmail } = require("validator");
// const bcrypt = require("bcrypt");
import validator from "validator";
import mongoose from "mongoose";
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
  occupation: {
    type: String,
  },
  medicalHistoryDetails: {
    type: String,
  },
  IP: {
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

export const Patient = mongoose.model("Patient", patientSchema);
