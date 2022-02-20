import { Appointment } from "../models/Appointment.js";
import { Patient } from "../models/Patient.js";

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

    const appointments = await Appointment.find({ doctor: userId });

    res.json({ appointments });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};
