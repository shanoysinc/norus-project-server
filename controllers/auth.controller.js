import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import bcrypt from "bcrypt";
import { Roles } from "../const/index.js";
import { generateToken } from "../helpers/index.js";
import { assignAvailableDoctor } from "../helpers/doctor/assignAvailableDoc.js";

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

    const availableDoctor = await assignAvailableDoctor();

    const patient = new Patient({
      firstName,
      lastName,
      occupation,
      medicalHistoryDetials,
      email,
      password,
      doctor: availableDoctor ? availableDoctor._id : null,
      IP: req.connection.remoteAddress,
    });

    await patient.save();

    if (availableDoctor) {
      await Doctor.findOneAndUpdate(
        { _id: availableDoctor._id },
        { $push: patient._id }
      );
    }
    const token = generateToken(patient._id, Roles.PATIENT);

    await patient.set({ token });
    await patient.save();

    res.json({ patient, auth: true });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
      auth: false,
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

    await patient.set({ token, IP: req.connection.remoteAddress });
    await patient.save();

    res.json({ patient, auth: true });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
      auth: false,
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

    res.json({ doctor, auth: true });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
      auth: false,
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

// improve assign doctor algorithm by checking only appointment with dates that have yet to come
