exports.server = () => {
  const PORT_NUMBER = 9001;
  const express = require("express");
  const app = express();
  const { healthService } = require("../src/services/health-service");
  const { databaseService } = require("../src/services/database-service");

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/health", (req, res) => {
    const { body, statusCode } = healthService();

    res.status(statusCode).send(body);
  });

  app.get("/user", async (req, res) => {
    const { body, statusCode } = await databaseService();

    res.status(statusCode).send(body);
  });

  app.listen(PORT_NUMBER);

  console.log(`Listening on PORT: ${PORT_NUMBER}`);
};
