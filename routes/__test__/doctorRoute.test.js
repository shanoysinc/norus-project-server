import { serverConfig } from "../../test/setup.js";
import { startServer } from "../../app.js";
import * as generate from "../../test/util/generate.js";
import * as dbSetup from "../../test/util/dbUtils.js";
import axios from "axios";

let patientInfo = { email: "mike@gmail.com", password: "123456" };
let doctorInfo = {
  email: "doc@gmail.com",
  password: "123456",
};

let server;
let baseURL = "http://localhost:8000";
let baseApiClient = axios.create({ baseURL });
let currentSignInDoctor;
let currentSignInPatient;

process.env.JWT_SECRET = "testsecretkey";

beforeAll(async () => {
  server = await startServer(serverConfig);
  const genDoctor = generate.doctorSignupInfo(doctorInfo);
  await dbSetup.createDoctor(genDoctor);

  //signup patient
  const patientSignupInfo = generate.patientSignupInfo(patientInfo);
  const signupPatientResult = await baseApiClient.post(
    "/patient/signup",
    patientSignupInfo
  );

  // login in doctor
  const loginDoctorResult = await baseApiClient.post(
    "/doctor/login",
    doctorInfo
  );

  const loginDoctorData = loginDoctorResult.data;
  currentSignInDoctor = loginDoctorData.doctor;

  // login patient
  const loginPatientResult = await baseApiClient.post(
    "/patient/login",
    patientInfo
  );
  const loginPatientData = loginPatientResult.data;
  currentSignInPatient = loginPatientData.patient;
});

afterAll(() => {
  dbSetup.resetDb();
  server.close();
});

test("Invlaid token provided to doctor route", async () => {
  try {
    const getDoctor = await baseApiClient.get("/doctor", {
      headers: {
        authorization: `Bearer INVALID_TOKEN`,
      },
    });

    expect(getDoctor).toBeFalsy();
  } catch (err) {
    expect(err).toMatchInlineSnapshot(
      `[Error: Request failed with status code 401]`
    );
  }
});

test("Visit doctor's authenticated route", async () => {
  const getDoctor = await baseApiClient.get("/doctor", {
    headers: {
      authorization: `Bearer ${currentSignInDoctor.token}`,
    },
  });

  const doctorData = getDoctor.data;
  const currentDoctor = doctorData.doctor;
  const doctorToken = currentDoctor.token;

  expect(doctorToken).toBeTruthy();
  expect(doctorData.auth).toBeTruthy();
  expect(currentDoctor.password).toBeFalsy();
});

test("get current doctor's patients", async () => {
  const getPatients = await baseApiClient.get("/doctor/patients", {
    headers: {
      authorization: `Bearer ${currentSignInDoctor.token}`,
    },
  });

  const getPatientsData = getPatients.data;
  const docPatients = getPatientsData.patients;
  const firstIndexPatient = docPatients[0];
  expect(firstIndexPatient.doctor).toEqual(currentSignInDoctor._id);

  expect(currentSignInDoctor.patients).toContain(firstIndexPatient._id);
});

test("get current doctor's appointments", async () => {
  try {
    const getappointments = await baseApiClient.get("/doctor/appointments", {
      headers: {
        authorization: `Bearer ${currentSignInDoctor.token}`,
      },
    });

    const getappointmentsData = getappointments.data;
    const docAppointments = getappointmentsData.appointments;

    expect(docAppointments).toEqual([]);
    const generatedAppointment = generate.buildAppointment({
      doctor: currentSignInDoctor._id,
    });
    const newAppointment = await baseApiClient.post(
      "/patient/appointment",
      generatedAppointment,
      {
        headers: {
          authorization: `Bearer ${currentSignInPatient.token}`,
        },
      }
    );
    const appointment = newAppointment.data.appointment;
    expect(appointment.symptom).toBe(generatedAppointment.symptom);
    expect(appointment.patientIP).toBeTruthy();
    expect(appointment.approve).toBeFalsy();
    expect(appointment.doctor).toEqual(currentSignInDoctor._id);
    expect(appointment.patient).toEqual(currentSignInPatient._id);

    const getUpdateAppointments = await baseApiClient.get(
      "/doctor/appointments",
      {
        headers: {
          authorization: `Bearer ${currentSignInDoctor.token}`,
        },
      }
    );

    const updateAppointments = getUpdateAppointments.data.appointments;

    expect(updateAppointments).toHaveLength(1);
  } catch (err) {
    throw new Error(err);
  }
});

test("update current doctor's appointments", async () => {
  try {
    const getappointments = await baseApiClient.get("/doctor/appointments", {
      headers: {
        authorization: `Bearer ${currentSignInDoctor.token}`,
      },
    });

    const getappointmentsData = getappointments.data;
    const docAppointments = getappointmentsData.appointments;

    const firstIndexAppointment = docAppointments[0];

    const updatedAppontmentOne = await baseApiClient.patch(
      "/doctor/appointments",
      {
        currentAppointmentId: firstIndexAppointment._id,
        approve: firstIndexAppointment.approve,
      },
      {
        headers: {
          authorization: `Bearer ${currentSignInDoctor.token}`,
        },
      }
    );

    expect(updatedAppontmentOne.data.appointment.approve).toBeTruthy();

    const updatedAppontmentTwo = await baseApiClient.patch(
      "/doctor/appointments",
      {
        currentAppointmentId: firstIndexAppointment._id,
        approve: updatedAppontmentOne.data.appointment.approve,
      },
      {
        headers: {
          authorization: `Bearer ${currentSignInDoctor.token}`,
        },
      }
    );
    expect(updatedAppontmentTwo.data.appointment.approve).toBeFalsy();
  } catch (err) {
    throw new Error(err);
  }
});
