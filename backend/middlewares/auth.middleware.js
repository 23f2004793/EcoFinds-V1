import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function authUser(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "unauthorized: token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    req.user = user;

    return next();
  } catch (e) {
    return res.status(401).json({ msg: "unauthorized" });
  }
}
