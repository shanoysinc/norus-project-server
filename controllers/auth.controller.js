import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import jsonwebToken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Roles } from "../const/index.js";

export const patientSignup = async (req, res) => {
  try {
    console.log("body", req.body);
    const { name, occupation, medicalHistoryDetials, email, password, doctor } =
      req.body;

    const patientExist = await Patient.findOne({ email });

    if (patientExist) {
      throw Error("patient already exist");
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const patient = new Patient({
      name,
      occupation,
      medicalHistoryDetials,
      email,
      password: hashPassword,
      doctor,
    });

    await patient.save();
    const token = generateToken(patient._id, Roles.PATIENT);

    res.json({ patient, token });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};
export const patientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("run");
    const patient = await Patient.findOne({ email }).select("+password");

    if (!patient) {
      throw Error("Please enter correct credentials");
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);
    console.log("password", passwordMatch);

    if (!passwordMatch) {
      throw Error("Please enter correct credentials");
    }

    const token = generateToken(patient._id, Roles.PATIENT);

    res.json({ patient, token });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const doctorLogin = async () => {};

const generateToken = (userId, userRole) => {
  const token = jsonwebToken.sign({ userId, userRole }, process.env.JWT_SECRET);
  return token;
};
