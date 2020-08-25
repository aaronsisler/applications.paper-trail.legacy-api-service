import { DatabaseService } from "../database-service";
import { Transaction } from "../../models/transaction";
import { TransactionMapper } from "../../mappers/transaction-mapper";
import { DatabaseTypes } from "../../constants";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    try {
      const {
        transactions: rawTransactions
      } = await this.databaseService.getItem("userId", userId, `transactions`);
      transactions = this.mapRawTransactions(
        rawTransactions[DatabaseTypes.OBJECT]
      );
    } catch (error) {
      console.log("ERROR: TransactionService");
      console.log(error);
    }

    return transactions;
  }

  private mapRawTransactions(rawTransactions: any): Transaction[] {
    const transactions: Transaction[] = Object.keys(rawTransactions).map(
      (key: string) => {
        return TransactionMapper.mapTransaction(
          rawTransactions[key][DatabaseTypes.OBJECT],
          key
        );
      }
    );
    return transactions;
  }
}

export { TransactionService };
