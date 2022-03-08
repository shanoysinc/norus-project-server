/* eslint-disable no-undef */
import { serverConfig } from "../../test/setup.js";
import { startServer } from "../../app.js";
import * as generate from "../../test/util/generate.js";
import * as dbSetup from "../../test/util/dbUtils.js";
import { baseApiClient } from "../../test/util/baseApiClient.js";
import {
  signupGeneratedPatient,
  loginGeneratedDoctor,
  loginGeneratedPatient,
} from "../../test/util/generatedRequest.js";
import { doctorInfo, patientInfo } from "../../test/util/testData.js";

let server;
let currentSignInDoctor;
let currentSignInPatient;

process.env.JWT_SECRET = "testsecretkey";

beforeAll(async () => {
  server = await startServer(serverConfig);
});

beforeEach(async () => {
  await dbSetup.addGeneratedDoctorDatabase(doctorInfo);

  //signup patient
  await signupGeneratedPatient(patientInfo);

  // login in doctor
  currentSignInDoctor = await loginGeneratedDoctor(doctorInfo);

  // login patient
  currentSignInPatient = await loginGeneratedPatient(patientInfo);
});

afterEach(async () => {
  await dbSetup.resetDb();
});
afterAll(async () => {
  await dbSetup.dbCloseConnection();
  await server.close();
});

test("[GET]:METHOD  Visit patient's authenticated route", async () => {
  try {
    const getPatient = await baseApiClient.get("/patient", {
      headers: {
        authorization: `Bearer ${currentSignInPatient.token}`,
      },
    });

    const patientData = getPatient.data;
    const currentPatient = patientData.patient;
    const patientToken = currentPatient.token;

    expect(patientToken).toBeTruthy();
    expect(patientData.auth).toBeTruthy();
    expect(currentPatient.password).toBeFalsy();
  } catch (err) {
    throw new Error(err);
  }
});

test("[GET]:METHOD  invalid token to patient's authenticated route", async () => {
  try {
    const getPatient = await baseApiClient.get("/patient", {
      headers: {
        authorization: `Bearer INVALID_TOKEN`,
      },
    });

    const patientData = getPatient.data;
    const currentPatient = patientData.patient;
    const patientToken = currentPatient.token;

    expect(patientToken).toBeFalsy();
    expect(patientData.auth).toBeFalsy();
  } catch (err) {
    expect(err.response.status).toBe(401);
    expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "error": true,
  "errorMessage": "jwt malformed",
}
`);
    expect(err).toMatchInlineSnapshot(
      `[Error: Request failed with status code 401]`
    );
  }
});

test("[GET]:METHOD  get  current patient's appointments", async () => {
  try {
    const getappointments = await baseApiClient.get("/patient/appointment", {
      headers: {
        authorization: `Bearer ${currentSignInPatient.token}`,
      },
    });

    const getappointmentsData = getappointments.data;
    const patAppointments = getappointmentsData.appointments;

    expect(patAppointments).toEqual([]);
  } catch (err) {
    throw new Error(err);
  }
});

test("[POST]:METHOD create patient appointment", async () => {
  const generatedAppointmentOne = generate.buildAppointment({
    doctor: currentSignInDoctor._id,
  });
  const newAppointment = await baseApiClient.post(
    "/patient/appointment",
    generatedAppointmentOne,
    {
      headers: {
        authorization: `Bearer ${currentSignInPatient.token}`,
      },
    }
  );
  const appointment = newAppointment.data.appointment;
  expect(appointment.symptom).toBe(generatedAppointmentOne.symptom);
  expect(appointment.patientIP).toBeTruthy();
  expect(appointment.approve).toBeFalsy();
  expect(appointment.doctor).toEqual(currentSignInDoctor._id);
  expect(appointment.patient).toEqual(currentSignInPatient._id);

  const generatedAppointmentTwo = generate.buildAppointment({
    doctor: currentSignInDoctor._id,
  });
  await baseApiClient.post("/patient/appointment", generatedAppointmentTwo, {
    headers: {
      authorization: `Bearer ${currentSignInPatient.token}`,
    },
  });

  const getappointments = await baseApiClient.get("/patient/appointment", {
    headers: {
      authorization: `Bearer ${currentSignInPatient.token}`,
    },
  });

  const getappointmentsData = getappointments.data;
  const patAppointments = getappointmentsData.appointments;

  expect(patAppointments).toHaveLength(2);

  const getPatientTimline = await baseApiClient.get("/patient/timeline", {
    headers: {
      authorization: `Bearer ${currentSignInPatient.token}`,
    },
  });

  const patientTimline = getPatientTimline.data.patientTimeline;
  expect(patientTimline).toHaveLength(2);
});

test("[POST]:METHOD invalid token when deleting patient's data", async () => {
  try {
    const deletePatient = await baseApiClient.post(
      "/patient/data",
      { password: "INVALID_PASSWORD" },
      {
        headers: {
          authorization: `Bearer INVALID_TOKEN`,
        },
      }
    );

    expect(deletePatient.data.success).toBeFalsy();
  } catch (err) {
    expect(err.response.status).toMatchInlineSnapshot(`401`);
    expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "error": true,
  "errorMessage": "jwt malformed",
}
`);
  }
});

test("[POST]:METHOD no password provided when deleting patient's data", async () => {
  try {
    const deletePatient = await baseApiClient.post(
      "/patient/data",
      {},
      {
        headers: {
          authorization: `Bearer ${currentSignInPatient.token}`,
        },
      }
    );

    expect(deletePatient.data.success).toBeFalsy();
  } catch (err) {
    expect(err.response.status).toMatchInlineSnapshot(`401`);
    expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "error": true,
  "errorMessage": "invalid credentials",
}
`);
  }
});

test("[POST]:METHOD invalid password when deleting patient's data", async () => {
  try {
    const deletePatient = await baseApiClient.post(
      "/patient/data",
      { password: "INVALID_PASSWORD" },
      {
        headers: {
          authorization: `Bearer ${currentSignInPatient.token}`,
        },
      }
    );

    expect(deletePatient.data.success).toBeFalsy();
  } catch (err) {
    expect(err.response.status).toMatchInlineSnapshot(`401`);
    expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "error": true,
  "errorMessage": "Please enter correct password",
}
`);
  }
});

test("[POST]:METHOD remove patient's data", async () => {
  try {
    const deletePatient = await baseApiClient.post(
      "/patient/data",
      { password: patientInfo.password },
      {
        headers: {
          authorization: `Bearer ${currentSignInPatient.token}`,
        },
      }
    );

    expect(deletePatient.data.success).toBeTruthy();
  } catch (err) {
    throw new Error(err);
  }
});
