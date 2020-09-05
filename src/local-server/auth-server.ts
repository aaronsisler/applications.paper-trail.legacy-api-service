import express from "express";
import { healthService } from "../services/health-service";
import { AuthService } from "../services/auth-service";
import { UserService } from "../services/user-service";

const app = express();
const port = process.env.PORT || "9001";

app.get("/health", (_req, res) => {
  const body = healthService();

  return res.status(200).json(body);
});

app.get("/auth", async (req, res) => {
  const authService: AuthService = new AuthService();
  const authId: string = await authService.getAuthId(req);

  if (!authId) {
    return res.status(401).send();
  }

  const userService: UserService = new UserService();
  const user = await userService.getUserDetails(authId);
  if (!user) {
    return res.status(204).send();
  } else {
    return res.status(200).json(user);
  }
});

app.listen(port, (err) => {
  if (err) return console.error(err);

  return console.log(`Server is listening on ${port}`);
});
