import express from "express";
import { healthService } from "../services/health-service";
import { UserService } from "../services/user-service";
import { DatabaseService } from "../services/database-service";
import { TransactionService } from "../services/transaction-service";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";

const app = express();
const port = process.env.PORT || "9001";
const userId = "101389202411803829037";

app.get("/health", (_req, res) => {
  const body = healthService();

  return res.status(200).json(body);
});

app.get("/test", async (_req, res) => {
  const databaseService = new DatabaseService();
  await databaseService.getItem("userId", userId);

  return res.status(200).json();
});

app.get("/user", async (req, res) => {
  const userService = new UserService();
  const { userId } = req.params;
  const user: User = await userService.getUser(userId);

  return res.status(200).json({ user });
});

app.get("/transactions", async (req, res) => {
  const transactionService = new TransactionService();
  const transactions: Transaction[] = await transactionService.getTransactions(
    userId
  );

  return res.status(200).json(transactions);
});

app.listen(port, (err) => {
  if (err) return console.error(err);

  return console.log(`Server is listening on ${port}`);
});
