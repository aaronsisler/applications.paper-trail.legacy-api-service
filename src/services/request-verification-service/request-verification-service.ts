import { Transaction } from "../../models/transaction";

class RequestVerificationService {
  verifyTransaction = (transaction: Transaction): void => {
    const hasEmptyAttributes = Object.values(transaction).some(
      (x) => x === null || x === undefined
    );

    if (hasEmptyAttributes) {
      throw new Error("Transaction has undefined attributes");
    }

    const hasEmptyArrays = Object.values(transaction).some(
      (x) => Array.isArray(x) && x.length === 0
    );

    if (hasEmptyArrays) {
      throw new Error("Transaction has empty attribute arrays");
    }
  };
}

export { RequestVerificationService };
