import { Patient } from "../../models/Patient.js";
import { Appointment } from "../../models/Appointment.js";
import { Doctor } from "../../models/Doctor.js";
import { PatientTimline } from "../../models/PatientTimline.js";
import mongoose from "mongoose";

export function resetDb() {
  if (Patient.db.collections["patients"]) {
    Patient.db.dropCollection("patients");
  }

  if (Appointment.db.collections["patients"]) {
    Appointment.db.dropCollection("appointments");
  }

  if (Doctor.db.collections["doctors"]) {
    Doctor.db.dropCollection("doctors");
  }

  if (PatientTimline.db.collections["patienttimelines"]) {
    PatientTimline.db.dropCollection("patienttimelines");
  }
}

export async function createDoctor(doctor) {
  const doc = new Doctor(doctor);
  await doc.save();
  return doc;
}
