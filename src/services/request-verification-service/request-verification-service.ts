import { Transaction } from "../../models/transaction";
import { User } from "../../models/user";

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

  verifyUser = (user: User): void => {
    const hasEmptyAttributes = Object.values(user).some(
      (x) => x === null || x === undefined
    );

    if (hasEmptyAttributes) {
      throw new Error("User has undefined attributes");
    }
  };
}

export { RequestVerificationService };
