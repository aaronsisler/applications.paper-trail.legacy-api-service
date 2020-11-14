import express from "express";
import { HealthService } from "../services/health-service";
import { UserService } from "../services/user-service";
import { DatabaseService } from "../services/database-service";
import { TransactionService } from "../services/transaction-service";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";

const app = express();
const port = process.env.PORT || "9001";
const userId = "101389202411803829037";

app.get("/test", async (req, res) => {
  const databaseService = new DatabaseService();
  // await databaseService.create("userId", "123");

  return res.status(200).json("Worked");
});

app.get("/health", (_req, res) => {
  const body = new HealthService().getHealth();

  return res.status(200).json(body);
});

app.get("/user", async (req, res) => {
  const userService = new UserService();
  const user: User = await userService.getUserDetails(userId);

  return res.status(200).json(user);
});

app.get("/transactions", async (req, res) => {
  const transactionService = new TransactionService();
  const transactions: Transaction[] = await transactionService.getTransactions(
    userId
  );

  return res.status(200).json(transactions);
});

app
  .listen(port, () => {
    console.log(`Server is listening on ${port}`);
  })
  .on("error", (e) => {
    console.error("Error happened: ", e.message);
  });
