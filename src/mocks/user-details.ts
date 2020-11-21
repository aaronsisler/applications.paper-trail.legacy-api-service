import { User } from "../models/user";

const userDetails = new User({
  userId: "mock-user-id",
  firstName: "mock-first-name",
  lastName: "mock-last-name"
});

export { userDetails };
