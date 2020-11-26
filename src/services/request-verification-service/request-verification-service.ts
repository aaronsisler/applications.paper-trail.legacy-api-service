/* eslint-disable function-paren-newline */
import { Transaction } from "../../models/transaction";
import { User } from "../../models/user";
import { isStringEmpty } from "../../utils/string-utils";

class RequestVerificationService {
  verifyTransaction = (transaction: Transaction): void => {
    const hasEmptyAttributes = Object.values(transaction).some((x) =>
      isStringEmpty(x)
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
    const hasEmptyAttributes = Object.values(user).some((x) =>
      isStringEmpty(x)
    );

    if (hasEmptyAttributes) {
      throw new Error("User has undefined attributes");
    }
  };
}

export { RequestVerificationService };
