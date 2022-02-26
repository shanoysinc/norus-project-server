import { Doctor } from "../../models/Doctor.js";
import { Patient } from "../../models/Patient";
import {
  BuildDoctor,
  buildNext,
  BuildPatient,
  buildReq,
  buildRes,
} from "../../test/util/generate.js";
import { assignAvailableDoctor } from "../../helpers/doctor/assignAvailableDoc.js";
import { patientSignup } from "../auth.controller.js";

jest.mock("../../models/Doctor.js");
jest.mock("../../models/Patient.js");
jest.mock("../../helpers/doctor/assignAvailableDoc.js");

beforeEach(() => {
  jest.clearAllMocks();
});

test("", () => {});
// test("patient login controller", async () => {
//   const patient = BuildPatient();
//   const doctor = BuildDoctor();
//   const req = buildReq({ body: patient });
//   const res = buildRes();
//   const next = buildNext();
//   assignAvailableDoctor.mockResolvedValueOnce(doctor);
//   Patient.mockResolvedValueOnce(patient);

//   await patientSignup(req, res);
//   expect(Patient.findOne).toHaveBeenCalled();
//   expect(Patient.findOne).toHaveBeenCalledWith({ email: patient.email });

//   expect().toHaveBeenCalled();
// });

// test("patient login controller", async () => {
//   const patient = BuildPatient();
//   const doctor = BuildDoctor();
//   const req = buildReq({ body: {email: patient.email, password: patient.password} });
//   const res = buildRes();
//   const next = buildNext();
//   assignAvailableDoctor.mockResolvedValueOnce(doctor);
//   Patient.mockResolvedValueOnce(patient);

//   await patientSignup(req, res);
//   expect(Patient.findOne).toHaveBeenCalled();
//   expect(Patient.findOne).toHaveBeenCalledWith({ email: patient.email });

//   expect().toHaveBeenCalled();
// });
