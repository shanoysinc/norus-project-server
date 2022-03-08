/* eslint-disable no-undef */
import { startServer } from "../../app.js";
import * as generate from "../../test/util/generate.js";
import * as dbSetup from "../../test/util/dbUtils.js";
import { serverConfig } from "../../test/setup.js";
import { baseApiClient } from "../../test/util/baseApiClient.js";
import { patientInfo, doctorInfo } from "../../test/util/testData.js";

let server;
let doctorOne;

process.env.JWT_SECRET = "testsecretkey";

beforeAll(async () => {
  server = await startServer(serverConfig);
});
beforeEach(async () => {
  doctorOne = await dbSetup.addGeneratedDoctorDatabase(doctorInfo);
});

afterEach(async () => {
  await dbSetup.resetDb();
});

afterAll(async () => {
  await dbSetup.dbCloseConnection();
  server.close();
});

describe("test auth flow", () => {
  test("test patient auth flow", async () => {
    try {
      //sign up patient
      const patientSignupInfo = generate.patientSignupInfo(patientInfo);

      const signupResult = await baseApiClient.post(
        "/patient/signup",
        patientSignupInfo
      );

      const signupData = signupResult.data;
      const signupPatient = signupData.patient;

      expect(signupPatient.doctor._id).toEqual(doctorOne._id.toString());
      expect(signupPatient.token).toBeTruthy();
      expect(signupData.auth).toBeTruthy();
      expect(signupPatient.password).toBeFalsy();

      //login patient
      const loginResult = await baseApiClient.post(
        "/patient/login",
        patientInfo
      );

      const loginData = loginResult.data;
      const loginPatient = loginData.patient;
      const loginPatientToken = loginPatient.token;

      expect(loginPatientToken).toBeTruthy();
      expect(loginData.auth).toBeTruthy();
      expect(loginPatient.password).toBeFalsy();

      //logout current user
      const logoutResult = await baseApiClient.post(
        "/user/logout",
        {},
        {
          headers: {
            authorization: `Bearer ${loginPatientToken}`,
          },
        }
      );

      const logoutData = logoutResult.data;
      expect(logoutData.success).toBeTruthy();
    } catch (err) {
      throw new Error(err);
    }
  });

  test("test doctor auth flow", async () => {
    try {
      //login doctor
      const loginResult = await baseApiClient.post("/doctor/login", doctorInfo);

      const loginData = loginResult.data;
      const loginDoctor = loginData.doctor;
      const loginDoctorToken = loginDoctor.token;

      expect(loginDoctorToken).toBeTruthy();
      expect(loginData.auth).toBeTruthy();
      expect(loginDoctor.password).toBeFalsy();

      //logout current user
      const logoutResult = await baseApiClient.post(
        "/user/logout",
        {},
        {
          headers: {
            authorization: `Bearer ${loginDoctorToken}`,
          },
        }
      );

      const logoutData = logoutResult.data;
      expect(logoutData.success).toBeTruthy();
    } catch (err) {
      throw new Error(err);
    }
  });
});

describe("[PATIENT] auth errors when loggin in and signing up", () => {
  test("[Error] Patient already exist", async () => {
    try {
      //sign up patient
      const patientSignupInfo = generate.patientSignupInfo(patientInfo);

      await baseApiClient.post("/patient/signup", patientSignupInfo);
      await baseApiClient.post("/patient/signup", patientSignupInfo);
    } catch (err) {
      expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "auth": false,
  "error": true,
  "errorMessage": "patient already exist",
}
`);
    }
  });

  test("[Error] There are no available Doctor", async () => {
    try {
      await dbSetup.resetDb();

      const patientSignupInfo = generate.patientSignupInfo(patientInfo);

      await baseApiClient.post("/patient/signup", patientSignupInfo);
    } catch (err) {
      expect(err.response.data).toMatchInlineSnapshot(
        `"There are no available Doctor"`
      );
    }
  });

  test("[Error] User enter Incorrect email address  for patient route when logging in", async () => {
    try {
      await baseApiClient.post("/patient/login", {
        email: "Test@gmail.com",
        password: "fjuchdu8i",
      });
    } catch (err) {
      expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "auth": false,
  "error": true,
  "errorMessage": "Please enter correct credentials",
}
`);
    }
  });
  test("[Error] User enter Incorrect password  for patient route when logging in", async () => {
    try {
      const patientSignupInfo = generate.patientSignupInfo(patientInfo);

      await baseApiClient.post("/patient/signup", patientSignupInfo);
      await baseApiClient.post("/patient/login", {
        email: patientInfo.email,
        password: "fjuchdu8i",
      });
    } catch (err) {
      expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "auth": false,
  "error": true,
  "errorMessage": "Please enter correct credentials",
}
`);
    }
  });
});

describe("[DOCTOR] auth errors when loggin in and signing up", () => {
  test("[Error] User enter Incorrect email address for doctor route when logging in", async () => {
    try {
      await baseApiClient.post("/doctor/login", {
        email: "INCORRECT_EMAIL@gmail.com",
        password: "INCORRECT_PASSWORD",
      });
    } catch (err) {
      expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "auth": false,
  "error": true,
  "errorMessage": "Please enter correct credentials",
}
`);
    }
  });

  test("[Error] User enter Incorrect password for doctor route when logging in", async () => {
    try {
      await baseApiClient.post("/doctor/login", {
        email: doctorInfo.email,
        password: "INCORRECT_PASSWORD",
      });
    } catch (err) {
      expect(err.response.data).toMatchInlineSnapshot(`
Object {
  "auth": false,
  "error": true,
  "errorMessage": "Please enter correct credentials",
}
`);
    }
  });
});
