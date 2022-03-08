import { Patient } from "../../models/Patient.js";
import { Doctor } from "../../models/Doctor.js";
import mongoose from "mongoose";
import * as generate from "./generate.js";
import { serverConfig } from "../setup.js";

export async function resetDb() {
  const db = await mongoose.connect(serverConfig.DB_URL);
  await db.connection.db.dropDatabase();
}
export async function dbCloseConnection() {
  const db = await mongoose.connect(serverConfig.DB_URL);
  db.connection.close();
}

export async function createDoctor(doctor) {
  const doc = new Doctor(doctor);
  await doc.save();
  return doc;
}
export async function createPatient(patient) {
  const pat = new Patient(patient);
  await pat.save();
  return pat;
}

export async function addGeneratedDoctorDatabase(doctorInfo) {
  const genDoctor = generate.doctorSignupInfo(doctorInfo);
  return await createDoctor(genDoctor);
}
