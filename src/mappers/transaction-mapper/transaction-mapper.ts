import { DatabaseItem } from "../../models/database-item";
import { Transaction } from "../../models/transaction";
import { DatabaseTypes } from "../../constants";

export class TransactionMapper {
  static mapTransaction(
    rawTransaction: DatabaseItem,
    transactionId: string
  ): Transaction {
    const transCategoryIds = this.mapRawTransCategories(
      rawTransaction.transCategoryIds[DatabaseTypes.ARRAY]
    );
    const transaction: Transaction = new Transaction({
      transId: transactionId,
      sourceTransId: rawTransaction.sourceTransId[DatabaseTypes.STRING],
      amount: rawTransaction.amount[DatabaseTypes.NUMBER],
      financialAccountId:
        rawTransaction.financialAccountId[DatabaseTypes.STRING],
      transCategoryIds,
      transDate: rawTransaction.transDate[DatabaseTypes.STRING],
      merchantName: rawTransaction.merchantName[DatabaseTypes.STRING],
      merchantAltName: rawTransaction.merchantAltName[DatabaseTypes.STRING],
      isPending: rawTransaction.isPending[DatabaseTypes.BOOLEAN]
    });

    return transaction;
  }

  private static mapRawTransCategories(
    rawTransactionCategories: DatabaseItem[]
  ) {
    return rawTransactionCategories.map(
      (rawCategory) => rawCategory[DatabaseTypes.STRING]
    );
  }
}
