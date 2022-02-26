import mongoose from "mongoose";

const patientTimlineSchema = new mongoose.Schema({
  approve: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
});

export const PatientTimline = mongoose.model(
  "PatientTimeline",
  patientTimlineSchema
);
