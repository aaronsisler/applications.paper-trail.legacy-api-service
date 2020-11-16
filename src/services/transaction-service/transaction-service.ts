import { DATABASE_TABLE_TRANSACTIONS } from "../../config";
import { DatabaseService } from "../database-service";
import { Transaction } from "../../models/transaction";
import { errorLogger } from "../../utils/error-logger";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    try {
      const key = { userId };
      const { transactions: rawTransactions } = await this.databaseService.read(
        DATABASE_TABLE_TRANSACTIONS,
        key
      );

      transactions = this.mapRawTransactions(rawTransactions);
    } catch (error) {
      errorLogger(TransactionService.name, error);
    }

    return transactions;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapRawTransactions = (rawTransactions: any): Transaction[] => {
    const transactions: Transaction[] = Object.keys(rawTransactions).map(
      (key: string) =>
        new Transaction({ transId: key, ...rawTransactions[key] })
    );

    return transactions;
  };
}

export { TransactionService };
