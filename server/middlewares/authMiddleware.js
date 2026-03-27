import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password -resetPasswordToken -resetPasswordExpiry -refreshToken");
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

export const educatorOnly = (req, res, next) => {
  if (req.user && (req.user.role === "educator" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as educator" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as admin" });
  }
};
