import { Doctor } from "../../models/Doctor.js";

export const assignAvailableDoctor = async () => {
  try {
    const doctors = await Doctor.find({ available: true });

    if (doctors.length < 1) {
      return null;
    }

    const doctor = findDocWithLeastAppointments(doctors);
    return doctor;
  } catch (err) {
    console.log(err);
  }
};

const findDocWithLeastAppointments = (doctors) => {
  let doctor = doctors[0];

  for (let index = 1; index < doctors.length; index++) {
    if (doctor.appointments.length > doctors[index].appointments.length) {
      doctor = doctors[index];
    }
  }

  return doctor;
};
