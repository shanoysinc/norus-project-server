// const mongoose = require("mongoose");
// const { isEmail } = require("validator");
// const bcrypt = require("bcrypt");

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
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

export const Doctor = mongoose.model("Doctor", doctorSchema);
