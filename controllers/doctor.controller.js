import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";

export const getDoctor = async (req, res) => {
  try {
    const { userId } = req.user;

    const doctor = await Doctor.findOne({ _id: userId });

    res.json({ auth: true, doctor });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};
export const getDoctorPatients = async (req, res) => {
  try {
    const { userId } = req.user;

    const patients = await Patient.find({ doctor: userId });

    res.json({ patients });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { userId } = req.user;

    const appointments = await Appointment.find({ doctor: userId }).populate(
      "patient"
    );

    res.json({ appointments });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};

export const updateDoctorAppointments = async (req, res) => {
  try {
    const { currentAppointmentId, approve } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: currentAppointmentId },
      {
        $set: { approve: !approve },
      }
    );

    res.json({ appointment });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};
