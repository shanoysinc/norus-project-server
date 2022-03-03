import { Roles } from "../../const/index.js";
import { generateToken } from "../../helpers/index.js";
import {
  BuildDoctor,
  buildNext,
  BuildPatient,
  buildReq,
  buildRes,
} from "../../test/util/generate.js";
import { verifyToken } from "../verifyToken.js";
import { Doctor } from "../../models/Doctor.js";
import { Patient } from "../../models/Patient.js";

jest.mock("../../models/Doctor.js");
jest.mock("../../models/Patient.js");

beforeEach(() => {
  jest.clearAllMocks();
});

process.env.JWT_SECRET = "thisisatest";

describe("testing verifytoken middleware", () => {
  test("verifying that a Doctor user has authorization", async () => {
    const doctor = BuildDoctor();
    const token = generateToken(doctor._id, Roles.DOCTOR);
    doctor.token = token;
    const req = buildReq({
      headers: { authorization: `Bearer ${token}` },
      user: { userRole: Roles.DOCTOR },
    });

    const res = buildRes();
    const next = buildNext();
    Doctor.findOne.mockResolvedValueOnce(doctor);

    await verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(Doctor.findOne).toHaveBeenCalledTimes(1);
    expect(Doctor.findOne).toHaveBeenCalledWith({ _id: doctor._id });
  });

  test("verifying that a Patient user has authorization", async () => {
    const patient = BuildPatient();
    const token = generateToken(patient._id, Roles.PATIENT);
    patient.token = token;
    const req = buildReq({
      headers: { authorization: `Bearer ${token}` },
      user: { userRole: Roles.PATIENT },
    });

    const res = buildRes();
    const next = buildNext();
    Patient.findOne.mockResolvedValueOnce(patient);

    await verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(Patient.findOne).toHaveBeenCalledTimes(1);
    expect(Patient.findOne).toHaveBeenCalledWith({ _id: patient._id });
  });

  test("No user token was provided", async () => {
    const patient = BuildPatient();
    const token = generateToken(patient._id, Roles.PATIENT);
    const req = buildReq({
      headers: { authorization: `Bearer ` },
      user: { userRole: Roles.PATIENT },
    });

    const res = buildRes();
    const next = buildNext();

    await verifyToken(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(Patient.findOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "A token is required for authentication",
]
`);
  });

  test("Token provided was not equal to the token in the patient database", async () => {
    const patient = BuildPatient();
    const token = generateToken(patient._id, Roles.PATIENT);
    const req = buildReq({
      headers: { authorization: `Bearer ${token}` },
      user: { userRole: Roles.PATIENT },
    });

    Patient.findOne.mockResolvedValueOnce(patient);

    const res = buildRes();
    const next = buildNext();

    await verifyToken(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(Patient.findOne).toHaveBeenCalledWith({ _id: patient._id });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "unauthorize access",
]
`);
  });

  test("Token provided was not equal to the token in the Doctor database", async () => {
    const doctor = BuildDoctor();
    const token = generateToken(doctor._id, Roles.DOCTOR);
    const req = buildReq({
      headers: { authorization: `Bearer ${token}` },
      user: { userRole: Roles.DOCTOR },
    });

    Doctor.findOne.mockResolvedValueOnce(doctor);

    const res = buildRes();
    const next = buildNext();

    await verifyToken(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(Doctor.findOne).toHaveBeenCalledWith({ _id: doctor._id });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "unauthorize access",
]
`);
  });

  test("Invalid token was provided", async () => {
    const req = buildReq({
      headers: { authorization: `Bearer sbibefubufbiudagygadyu` },
    });

    const res = buildRes();
    const next = buildNext();

    await verifyToken(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(Doctor.findOne).not.toHaveBeenCalled();
    expect(Patient.findOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  Object {
    "error": true,
    "errorMessage": "jwt malformed",
  },
]
`);
  });
});
