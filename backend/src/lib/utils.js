import jwt from "jsonwebtoken";

export const createToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, //prevent xss attacks cross-site scription attacks
    sameSite: "strict", // CSRF attacks cross-site request frogery attack
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
