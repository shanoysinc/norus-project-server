import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import bcrypt from "bcrypt";
import { Roles } from "../const/index.js";
import { generateToken } from "../helpers/index.js";

export const patientSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      occupation,
      medicalHistoryDetials,
      email,
      password,
    } = req.body;

    const patientExist = await Patient.findOne({ email });

    if (patientExist) {
      throw Error("patient already exist");
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const patient = new Patient({
      firstName,
      lastName,
      occupation,
      medicalHistoryDetials,
      email,
      password: hashPassword,
    });

    await patient.save();
    const token = generateToken(patient._id, Roles.PATIENT);

    await patient.set({ token });
    await patient.save();

    res.json({ patient });
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

    const patient = await Patient.findOne({ email }).select("+password");

    if (!patient) {
      throw Error("Please enter correct credentials");
    }

    const passwordMatch = await bcrypt.compare(password, patient.password);

    if (!passwordMatch) {
      throw Error("Please enter correct credentials");
    }
    const token = generateToken(patient._id, Roles.PATIENT);

    await patient.set({ token });
    await patient.save();

    res.json({ patient });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const patientLogout = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      throw Error("unathorize access");
    }

    const patient = await Patient.findOne({ _id: userId });

    await patient.set({ token: "" });
    await patient.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};

export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email }).select("+password");

    if (!doctor) {
      throw Error("Please enter correct credentials");
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {
      throw Error("Please enter correct credentials");
    }

    const token = generateToken(doctor._id, Roles.DOCTOR);
    await doctor.set({ token });
    await doctor.save();

    res.json({ doctor });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const doctorLogout = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      throw Error("unathorize access");
    }

    const doctor = await Doctor.findOne({ _id: userId });

    await doctor.set({ token: "" });
    await doctor.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};
