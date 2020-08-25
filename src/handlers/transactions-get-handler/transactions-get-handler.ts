import { HandlerResponse } from "../../models/handler-response";
import { Transaction } from "../../models/transaction";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { AuthService } from "../../services/auth-service";
import { TransactionService } from "../../services/transaction-service";

const transactionsGet = async (event: any, _context: any, callback: any) => {
  try {
    const authService = new AuthService();
    const authId: string = await authService.getAuthId(event);
    if (!authId) {
      const response: HandlerResponse = responseBodyBuilder({
        statusCode: 401,
        body: "Unauthorized"
      });

      return callback(null, response);
    }

    const transactionService = new TransactionService();
    const transactions: Transaction[] = await transactionService.getTransactions(
      authId
    );

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 200,
      body: transactions
    });

    return callback(null, response);
  } catch (error) {
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 500,
      body: "Error: Something went wrong"
    });
    return callback(null, response);
  }
};

export { transactionsGet };
