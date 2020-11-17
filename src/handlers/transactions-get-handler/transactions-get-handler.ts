import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HandlerResponse } from "../../models/handler-response";
import { Transaction } from "../../models/transaction";
import { AuthService } from "../../services/auth-service";
import { TransactionService } from "../../services/transaction-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const transactionsGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  let authId: string;

  try {
    const authService = new AuthService();
    authId = await authService.getAuthId(event);
  } catch (error) {
    errorLogger("Handler/Transactions:Get", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 401,
      body: "Unauthorized"
    });

    callback(null, response);
    return;
  }

  try {
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
    errorLogger("Handler/Transactions:Get", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 204,
      body: undefined
    });
    callback(null, response);
  }
};

export { transactionsGet };
