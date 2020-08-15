import { DatabaseService } from "../database-service";
import { DatabaseItem } from "../../models/database-item";
import { Transaction } from "../../models/transaction";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<Transaction> {
    let transaction: Transaction;
    const params = {
      Key: { S: userId },
      ProjectionExpression: `transactions.${transactionId}`
    };
    try {
      const rawTransaction: DatabaseItem = await this.databaseService.getTransaction(
        params
      );
      transaction = this.mapRawTransaction(rawTransaction);
      return transaction;
    } catch (error) {
      console.log("ERROR: TransactionService"); // TODO figure out AWS logging
      console.log(error);
    }

    return transaction;
  }

  mapRawTransaction(rawTransaction: any): Transaction {
    throw new Error("Method not implemented.");
  }
}

export { TransactionService };
