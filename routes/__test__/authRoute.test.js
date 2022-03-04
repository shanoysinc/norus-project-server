import { startServer } from "../../app.js";
import * as generate from "../../test/util/generate.js";
import * as dbSetup from "../../test/util/dbUtils.js";
import axios from "axios";

let server;
let baseURL = "http://localhost:8000";
let baseApiClient = axios.create({ baseURL });
let doctorOne;

let patientInfo = { email: "mike@gmail.com", password: "123456" };
process.env.JWT_SECRET = "testsecretkey";

beforeAll(async () => {
  server = await startServer({
    PORT: 8000,
    DB_URL: "mongodb://localhost:27017/docapp-test",
    ORIGIN: "*",
    CORS_CREDENTIALS: false,
  });
});
beforeEach(async () => {
  dbSetup.resetDb();
  const doc = generate.doctorSignupInfo({
    email: "doc@gmail.com",
    password: "123456",
  });
  doctorOne = await dbSetup.createDoctor(doc);
});

afterAll(() => server.close());

describe("test auth flow", () => {
  test("test patient auth flow", async () => {
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
    const loginResult = await baseApiClient.post("/patient/login", patientInfo);

    const loginData = loginResult.data;
    const loginPatient = loginData.patient;

    expect(loginPatient.token).toBeTruthy();
    expect(loginData.auth).toBeTruthy();
    expect(loginPatient.password).toBeFalsy();
  });
});
