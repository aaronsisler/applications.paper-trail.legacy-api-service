import { DATABASE_TABLE_TRANSACTIONS } from "../../config";
import { Transaction } from "../../models/transaction";
import { DatabaseService } from "../database-service";
import { errorLogger } from "../../utils/error-logger";
import { KeyValuePair } from "../../models/key-value-pair";
import { DatabaseItem } from "../../models/database-item";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async createTransaction(
    userId: string,
    transaction: Transaction
  ): Promise<void> {
    try {
      const userIdKey = new KeyValuePair("userId", userId);
      const transIdKey = new KeyValuePair(
        "transactionId",
        transaction.transactionId
      );

      await this.databaseService.create(
        DATABASE_TABLE_TRANSACTIONS,
        [userIdKey, transIdKey],
        (transaction as unknown) as DatabaseItem
      );
    } catch (error) {
      errorLogger(TransactionService.name, error);
      throw new Error("Transaction not created");
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    try {
      const filterCondition = new KeyValuePair("userId", userId);
      const rawTransactions: unknown = await this.databaseService.read(
        DATABASE_TABLE_TRANSACTIONS,
        filterCondition
      );

      transactions = this.mapRawTransactions(rawTransactions);

      if (transactions.length === 0) {
        throw new Error("Transactions not found");
      }
      return transactions;
    } catch (error) {
      errorLogger(TransactionService.name, error);
      throw new Error("Transactions not found");
    }
  }

  private mapRawTransactions = (rawTransactions: any): Transaction[] => {
    const transactions: Transaction[] = rawTransactions.map(
      (rawTransaction: Transaction) => new Transaction({ ...rawTransaction })
    );

    return transactions;
  };
}

export { TransactionService };
