import { Patient } from "../models/Patient.js";
import bcyrpt from "bcrypt";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";

export const editProfile = async (req, res) => {
  try {
    const patientId = req.user;

    await Patient.findOneAndUpdate({ _id: patientId }, { $set: req.body });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw Error("invalid credentials");
    }

    const patient = await Patient.findOne({ _id: req.user.userId }).select(
      "+password"
    );

    const passwordMatch = await bcyrpt.compare(password, patient.password);

    if (!passwordMatch) {
      throw Error("invalid credentials");
    }
    await Patient.findOneAndDelete({ _id: req.user.userId });

    res.send({ success: true });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { userId } = req.user;

    const appointments = await Appointment.find({ patient: userId });

    res.json({ appointments });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { userId } = req.user;

    const { symptom, details, doctor, date } = req.body;

    const appointment = new Appointment({
      symptom,
      details,
      date,
      doctor,
      patient: userId,
      patientIP: req.connection.remoteAddress,
    });

    await Doctor.findOneAndUpdate(
      { _id: doctor },
      { $push: { appointment: appointment._id } }
    );

    await appointment.save();
    await Patient.findOneAndUpdate({ _id: userId }, { $set: { doctor } });

    res.json({ appointment });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};
