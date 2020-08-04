import express from "express";
import { healthService } from "./services/health-service";
import { UserService } from "./services/user-service";
import { User } from "./models/user";

const app = express();
const port = process.env.PORT || "9001";

app.get("/health", (_req, res) => {
  const body = healthService();

  return res.status(200).json(body);
});

app.get("/user/:userId", async (req, res) => {
  const userService = new UserService();
  const { userId } = req.params;
  const user: User = await userService.getUser(userId);

  return res.status(200).json({ user });
});

app.listen(port, (err) => {
  if (err) return console.error(err);

  return console.log(`Server is listening on ${port}`);
});
