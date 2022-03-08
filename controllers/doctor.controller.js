import { Appointment } from "../models/Appointment.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { PatientTimline } from "../models/PatientTimline.js";

export const getDoctor = async (req, res) => {
  try {
    const { userId } = req.user;

    const doctor = await Doctor.findOne({ _id: userId });

    res.json({ auth: true, doctor });
  } catch (err) {
    res.status(401).json({
      error: true,
      auth: false,
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
    res.status(401).json({
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
    res.status(401).json({
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
      },
      {
        returnOriginal: false,
      }
    );

    const timeline = new PatientTimline({
      patient: appointment.patient,
      appointment: appointment._id,
      approve: appointment.approve,
    });

    await timeline.save();

    res.json({ appointment });
  } catch (err) {
    res.status(401).json({
      error: true,
      errorMessage: err.message,
    });
  }
};
