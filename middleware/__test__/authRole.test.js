import { buildRes, buildNext, buildReq } from "../../test/util/generate.js";
import { authRole } from "../authRole.js";
import { Roles } from "../../const/index.js";

describe("Test authRole middleware", () => {
  test("doctor role is  accepted with routes for doctor", () => {
    const req = buildReq({ user: { userRole: Roles.DOCTOR } });
    const res = buildRes();
    const next = buildNext();

    authRole(Roles.DOCTOR)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("patient role is  accepted with routes for patient", () => {
    const req = buildReq({ user: { userRole: Roles.PATIENT } });
    const res = buildRes();
    const next = buildNext();

    authRole(Roles.PATIENT)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("patient role is not accepted with routes for doctor", () => {
    const req = buildReq({ user: { userRole: Roles.PATIENT } });
    const res = buildRes();
    const next = buildNext();

    authRole(Roles.DOCTOR)(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "Not allowed",
]
`);
  });

  test("doctor role is not accepted with routes for patient", () => {
    const req = buildReq({ user: { userRole: Roles.DOCTOR } });
    const res = buildRes();
    const next = buildNext();

    authRole(Roles.PATIENT)(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "Not allowed",
]
`);
  });
});
