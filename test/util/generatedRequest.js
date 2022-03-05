import * as generate from "../util/generate.js";
import { baseApiClient } from "./baseApiClient.js";

export const signupGeneratedPatient = async (patientInfo) => {
  // generate patient
  const patientSignupInfo = generate.patientSignupInfo(patientInfo);
  //signup generated patient
  const signupPatientResult = await baseApiClient.post(
    "/patient/signup",
    patientSignupInfo
  );

  return signupPatientResult;
};

export const loginGeneratedDoctor = async (doctorInfo) => {
  const loginDoctorResult = await baseApiClient.post(
    "/doctor/login",
    doctorInfo
  );

  const loginDoctorData = loginDoctorResult.data;
  return loginDoctorData.doctor;
};

export const loginGeneratedPatient = async (patientInfo) => {
  const loginPatientResult = await baseApiClient.post(
    "/patient/login",
    patientInfo
  );
  const loginPatientData = loginPatientResult.data;
  return loginPatientData.patient;
};
