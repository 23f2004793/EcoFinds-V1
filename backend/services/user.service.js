import User from "../models/user.model.js";

export async function createUser({ firstName, lastName, email, password }) {
  //   console.log(firstname, lastname, email, password);
  if (!firstName || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  return user;
}
