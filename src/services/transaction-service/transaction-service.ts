import { DatabaseService } from "../database-service";
import { DatabaseItem } from "../../models/database-item";
import { Transaction } from "../../models/transaction";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    const params = {
      Key: { userId: { S: userId } },
      ProjectionExpression: `transactions`
    };
    try {
      const {
        transactions: rawTransactions
      } = await this.databaseService.getTransactions(params);
      transactions = this.mapRawTransactions(rawTransactions["M"]);
    } catch (error) {
      console.log("ERROR: TransactionService"); // TODO figure out AWS logging
      console.log(error);
    }

    return transactions;
  }

  private mapRawTransactions(rawTransactions: any): Transaction[] {
    const transactions: Transaction[] = Object.keys(rawTransactions).map(
      (key: string) => {
        return this.mapRawTransaction(key, rawTransactions[key]["M"]);
      }
    );
    return transactions;
  }

  private mapRawTransaction(
    transactionId: string,
    rawTransaction: DatabaseItem
  ): Transaction {
    const transCategoryIds = this.mapRawTransCategories(
      rawTransaction.transCategoryIds["L"]
    );
    const transaction: Transaction = new Transaction({
      transId: transactionId,
      sourceTransId: rawTransaction.sourceTransId["S"],
      amount: rawTransaction.amount["N"],
      financialAccountId: rawTransaction.financialAccountId["S"],
      transCategoryIds,
      transDate: rawTransaction.transDate["S"],
      merchantName: rawTransaction.merchantName["S"],
      merchantAltName: rawTransaction.merchantAltName["S"],
      isPending: rawTransaction.isPending["BOOL"]
    });

    return transaction;
  }

  private mapRawTransCategories(rawTransactionCategories: DatabaseItem[]) {
    return rawTransactionCategories.map((rawCategory) => rawCategory["S"]);
  }
}

export { TransactionService };
