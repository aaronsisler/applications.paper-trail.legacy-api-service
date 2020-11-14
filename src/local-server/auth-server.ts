import express from "express";
import { HealthService } from "../services/health-service";
import { AuthService } from "../services/auth-service";
import { UserService } from "../services/user-service";

const app = express();
const port = process.env.PORT || "9001";

app.get("/auth", async (req, res) => {
  console.log(req);
  const authService: AuthService = new AuthService();
  const authId: string = await authService.getAuthId(req);

  if (!authId) {
    return res.status(401).send();
  }

  const userService: UserService = new UserService();
  const user = await userService.getUserDetails(authId);
  if (!user) {
    return res.status(204).send();
  }
  return res.status(200).json(user);
});

app.get("/health", (_req, res) => {
  const body = new HealthService().getHealth();

  return res.status(200).json(body);
});

app
  .listen(port, () => {
    console.log(`Server is listening on ${port}`);
  })
  .on("error", (e) => {
    console.error("Error happened: ", e.message);
  });
