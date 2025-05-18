import express from "express";
import { body } from "express-validator";
import {
  loginUser,
  registerUser,
  userProfile,
  userLogout,
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("firstName")
      .isLength({ min: 3 })
      .withMessage("Firstname must be atleast 3 letters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  registerUser
);

userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
  ],
  loginUser
);

userRouter.get("/profile", authUser, userProfile);
userRouter.get("/logout", authUser, userLogout);

export default userRouter;
