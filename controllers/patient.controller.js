import { Patient } from "../models/Patient.js";
import bcyrpt from "bcrypt";

export const deletePatient = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw Error("invalid credentials");
    }

    const patient = await Patient.findOne({ _id: req.user.userId }).select(
      "+password"
    );

    console.log(patient);
    const passwordMatch = await bcyrpt.compare(password, patient.password);

    if (!passwordMatch) {
      throw Error("invalid credentials");
    }
    await Patient.findOneAndDelete({ _id: req.user.userId });

    res.send({ success: true });
  } catch (err) {
    res.json({
      error: true,
      errorMessage: err.message,
    });
  }
};
