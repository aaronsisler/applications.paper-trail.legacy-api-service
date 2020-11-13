import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HandlerResponse } from "../../models/handler-response";
import { Transaction } from "../../models/transaction";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { AuthService } from "../../services/auth-service";
import { TransactionService } from "../../services/transaction-service";

const transactionsGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const authService = new AuthService();
    const authId: string = await authService.getAuthId(event);
    if (!authId) {
      const response: HandlerResponse = responseBodyBuilder({
        statusCode: 401,
        body: "Unauthorized"
      });

      callback(null, response);
      return;
    }

    const transactionService = new TransactionService();
    const transactions: Transaction[] = await transactionService.getTransactions(
      authId
    );

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 200,
      body: transactions
    });

    callback(null, response);
  } catch (error) {
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 500,
      body: "Error: Something went wrong"
    });
    callback(null, response);
  }
};

export { transactionsGet };
