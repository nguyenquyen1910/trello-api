import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
};

const generateRefreshToken = async (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

export const authUtils = {
  generateAccessToken,
  generateRefreshToken,
};
