import jsonwebToken from "jsonwebtoken";
export const generateToken = (userId, userRole) => {
  const token = jsonwebToken.sign({ userId, userRole }, process.env.JWT_SECRET);
  return token;
};
