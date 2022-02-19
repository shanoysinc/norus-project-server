import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  complain: {
    type: String,
    required: [true, "Please enter a reason's for visiting the doctor"],
  },
  details: {
    type: String,
  },
  patientIP: {
    type: String,
  },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
