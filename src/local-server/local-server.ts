import express from "express";
import { DATABASE_TABLE_TRANSACTIONS, DATABASE_TABLE_USERS } from "../config";
import { transactions } from "../mocks/transactions";
import { userDetails } from "../mocks/user-details";
import { DatabaseItem } from "../models/database-item";
import { KeyValuePair } from "../models/key-value-pair";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { AuthService } from "../services/auth-service";
import { DatabaseService } from "../services/database-service";
import { HealthService } from "../services/health-service";
import { TransactionService } from "../services/transaction-service";
import { UserService } from "../services/user-service";

const app = express();
const port = process.env.PORT || "9001";
const userId = "101389202411803829037";
const otherUserId = "101283742915444278865";

const authService: AuthService = new AuthService();
const databaseService = new DatabaseService();
const transactionService = new TransactionService();
const userService = new UserService();

app.get("/test-user", async (req, res) => {
  const userIdKey = new KeyValuePair("userId", userId);

  try {
    const newUser = new User({ ...userDetails, userId });

    await userService.createUser(newUser);

    return res.status(200).json("Worked");
  } catch (error) {
    return res.status(500).json("Failure");
  }
});

app.get("/test-trans", async (req, res) => {
  const transactionId = "789";
  const userIdKey = new KeyValuePair("userId", userId);
  const transIdKey = new KeyValuePair("transactionId", transactionId);

  try {
    const [transaction] = transactions;
    transaction.transactionId = transactionId;
    transaction.amount = 567;

    await transactionService.updateTransaction(userId, transaction);

    return res.status(200).json("Worked");
  } catch (error) {
    return res.status(500).json("Failure");
  }
});

app.get("/test-db", async (req, res) => {
  const transactionId = "789";
  // const userIdKey = new KeyValuePair("userId", userId);
  // const transIdKey = new KeyValuePair("transactionId", transactionId);
  const userIdKey = new KeyValuePair("userId", otherUserId);

  try {
    const [transaction] = transactions;
    transaction.transactionId = transactionId;
    transaction.amount = 456;

    const user = new User({
      userId: otherUserId,
      firstName: "Johnny",
      lastName: "Smith"
    });

    await databaseService.update(
      // DATABASE_TABLE_TRANSACTIONS,
      // [userIdKey, transIdKey],
      // (transaction as unknown) as DatabaseItem
      DATABASE_TABLE_USERS,
      [userIdKey],
      (user as unknown) as DatabaseItem
    );

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
  try {
    const user: User = await userService.getUser(userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(204).send();
  }
});

app.get("/transactions", async (req, res) => {
  const transactions: Transaction[] = await transactionService.getTransactions(
    userId
  );

  return res.status(200).json(transactions);
});

app.get("/auth", async (req, res) => {
  let authId: string;
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
