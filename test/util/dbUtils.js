import { Patient } from "../../models/Patient.js";
import { Appointment } from "../../models/Appointment.js";
import { Doctor } from "../../models/Doctor.js";
import { PatientTimline } from "../../models/PatientTimline.js";

export function resetDb() {
  Patient.db.dropCollection("patients");
  Appointment.db.dropCollection("appointments");
  Doctor.db.dropCollection("doctors");
  PatientTimline.db.dropCollection("patienttimelines");
}

export async function createDoctor(doctor) {
  const doc = new Doctor(doctor);
  await doc.save();
  return doc;
}
