import express from "express";
import healthService from "./services/health-service";

const app = express();
const port = process.env.PORT || "9001";

app.get("/health", (_req, res) => {
  const { statusCode, body } = healthService();

  return res.status(statusCode).json(body);
});

app.listen(port, (err) => {
  if (err) return console.error(err);

  return console.log(`Server is listening on ${port}`);
});
