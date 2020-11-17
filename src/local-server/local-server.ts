import express from "express";
import { AuthService } from "../services/auth-service";
import { HealthService } from "../services/health-service";
import { DatabaseService } from "../services/database-service";
import { TransactionService } from "../services/transaction-service";
import { UserService } from "../services/user-service";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { DATABASE_TABLE_TRANSACTIONS } from "../config";

const app = express();
const port = process.env.PORT || "9001";
const userId = "101389202411803829037";

app.get("/test", async (req, res) => {
  const databaseService = new DatabaseService();
  const transactionId = "789";
  const key = { userId, transactionId };
  const transaction = { amount: 789.21 };
  try {
    await databaseService.create(DATABASE_TABLE_TRANSACTIONS, key, transaction);
    return res.status(200).json("Worked");
  } catch (error) {
    return res.status(500).json("Failure");
  }
});

app.get("/health", (_req, res) => {
  const body = new HealthService().getHealth();

  return res.status(200).json(body);
});

app.get("/user", async (req, res) => {
  const userService = new UserService();
  const user: User = await userService.getUser(userId);

  return res.status(200).json(user);
});

app.get("/transactions", async (req, res) => {
  const transactionService = new TransactionService();
  const transactions: Transaction[] = await transactionService.getTransactions(
    userId
  );

  return res.status(200).json(transactions);
});

app.get("/auth", async (req, res) => {
  let authId: string;
  const authService: AuthService = new AuthService();
  try {
    authId = await authService.getAuthId(req);
    return res.status(200).json(authId);
  } catch (error) {
    return res.status(401).send();
  }
});

app
  .listen(port, () => {
    console.log(`Server is listening on ${port}`);
  })
  .on("error", (e) => {
    console.error("Error happened: ", e.message);
  });
