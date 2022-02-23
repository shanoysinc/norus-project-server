import { Patient } from "../models/Patient.js";
import bcyrpt from "bcrypt";
import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";

export const getPatient = async (req, res) => {
  try {
    const patientId = req.user.userId;

    const patient = await Patient.findOne({
      _id: patientId,
    });

    res.json({ auth: true, patient });
  } catch (err) {
    res.status(401).json({
      error: true,
      errorMessage: err.message,
      auth: false,
    });
  }
};
export const editProfile = async (req, res) => {
  try {
    const patientId = req.user;

    await Patient.findOneAndUpdate({ _id: patientId }, { $set: req.body });

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ success: false });
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
    const patientAppointments = await Appointment.find({
      patient: req.user.userId,
    });

    for (const appointment of patientAppointments) {
      await Doctor.findOneAndUpdate(
        { _id: appointment.doctor },
        {
          $pull: { appointments: appointment._id },
        }
      );
    }

    await Appointment.deleteMany({
      patient: req.user.userId,
    });

    await Patient.findOneAndDelete({ _id: req.user.userId });

    await Doctor.findOneAndUpdate(
      { _id: patient.doctor },
      {
        $pull: { patients: patient._id },
      }
    );

    res.send({ success: true });
  } catch (err) {
    res.status(401).json({
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
    res.status(401).json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { userId } = req.user;

    const { symptom, details, doctor, date, time } = req.body;

    const appointment = new Appointment({
      symptom,
      details,
      date,
      doctor,
      time,
      patient: userId,
      patientIP: req.connection.remoteAddress,
    });

    await Doctor.findOneAndUpdate(
      { _id: doctor },
      { $push: { appointments: appointment._id } }
    );

    await appointment.save();
    await Patient.findOneAndUpdate({ _id: userId }, { $set: { doctor } });

    res.json({ appointment });
  } catch (err) {
    res.status(401).json({
      error: true,
      errorMessage: err.message,
    });
  }
};
