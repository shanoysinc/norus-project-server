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

  await dbSetup.addGeneratedDoctorDatabase(doctorInfo);

  //signup patient
  await signupGeneratedPatient(patientInfo);

  // login in doctor
  currentSignInDoctor = await loginGeneratedDoctor(doctorInfo);

  // login patient
  currentSignInPatient = await loginGeneratedPatient(patientInfo);
});

afterAll(() => {
  dbSetup.resetDb();
  server.close();
});

test("[GET]:METHOD Visit doctor's authenticated route", async () => {
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

test("[GET]:METHOD get current doctor's patients", async () => {
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

test("[GET]:METHOD get current doctor's appointments", async () => {
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

test("[PATCH]:METHOD update current doctor's appointments", async () => {
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

test("[GET]:METHOD Invalid token provided to   doctor route", async () => {
  try {
    const getDoctor = await baseApiClient.get("/doctor", {
      headers: {
        authorization: `Bearer INVALID_TOKEN`,
      },
    });

    expect(getDoctor).toBeFalsy();
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

test("[GET]:METHOD Invalid token provided to   doctor patients route", async () => {
  try {
    const getPatients = await baseApiClient.get("/doctor/patients", {
      headers: {
        authorization: `Bearer INVALID_TOKEN`,
      },
    });

    expect(getPatients).toBeFalsy();
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

test("[GET]:METHOD Invalid token provided to  doctor appointments route", async () => {
  try {
    const getAppontments = await baseApiClient.get("/doctor/appointments", {
      headers: {
        authorization: `Bearer INVALID_TOKEN`,
      },
    });

    expect(getAppontments).toBeFalsy();
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

test("[PATCH]:METHOD  Invlaid token provided to doctor appointments route", async () => {
  try {
    const getAppontments = await baseApiClient.patch(
      "/doctor/appointments",
      {},
      {
        headers: {
          authorization: `Bearer INVALID_TOKEN`,
        },
      }
    );

    expect(getAppontments).toBeFalsy();
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

test("[PATCH]:METHOD  no data provided to doctor appointments route", async () => {
  try {
    const getAppontments = await baseApiClient.patch(
      "/doctor/appointments",
      {},
      {
        headers: {
          authorization: `Bearer ${currentSignInDoctor.token}`,
        },
      }
    );

    expect(getAppontments).toBeFalsy();
  } catch (err) {
    expect(err.response.status).toBe(401);
    expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "error": true,
  "errorMessage": "Cannot read properties of null (reading 'patient')",
}
`);
    expect(err).toMatchInlineSnapshot(
      `[Error: Request failed with status code 401]`
    );
  }
});
