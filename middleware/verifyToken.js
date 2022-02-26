import jwt from "jsonwebtoken";
import { Roles } from "../const/index.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userRole, userId } = decoded;
    if (userRole && userId) {
      if (userRole == Roles.DOCTOR) {
        const doctor = await Doctor.findOne({ _id: userId });

        if (!doctor || doctor.token !== token) {
          return res.status(403).send("unauthorize access");
        }
        req.user = decoded;
        return next();
      }
      if (userRole == Roles.PATIENT) {
        const patient = await Patient.findOne({ _id: userId });
        if (!patient || patient.token !== token) {
          return res.status(403).send("unauthorize access");
        }
        req.user = decoded;
        return next();
      }
    }
    return res.status(403).send("unauthorize access");
  } catch (err) {
    return res.status(401).send({ error: true, errorMessage: err.message });
  }
};
