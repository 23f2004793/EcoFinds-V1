import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { createUser } from "../services/user.service.js";

export async function registerUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ msg: "Email already in use" });
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await createUser({
    firstName: firstName,
    lastName: lastName,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.status(201).json({ token, user });
}

export async function loginUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invaid Email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invaid Email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({ token, user });
}

export async function userProfile(req, res, next) {
  res.status(200).json(req.user);
}

export async function userLogout(req, res, next) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json({ msg: "logged out successful" });
}
