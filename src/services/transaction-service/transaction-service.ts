import { DatabaseService } from "../database-service";
import { Transaction } from "../../models/transaction";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    try {
      const { transactions: rawTransactions } = await this.databaseService.read(
        "userId",
        userId,
        `transactions`
      );

      transactions = this.mapRawTransactions(rawTransactions);
    } catch (error) {
      console.log("ERROR: TransactionService");
      console.log(error);
    }

    return transactions;
  }

  private mapRawTransactions(rawTransactions: any): Transaction[] {
    const transactions: Transaction[] = Object.keys(rawTransactions).map(
      (key: string) =>
        new Transaction({ transId: key, ...rawTransactions[key] })
    );

    return transactions;
  }
}

export { TransactionService };
