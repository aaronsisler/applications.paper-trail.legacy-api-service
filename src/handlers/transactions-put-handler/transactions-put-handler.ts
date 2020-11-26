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
import { RequestVerificationService } from "../../services/request-verification-service";
import { TransactionService } from "../../services/transaction-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const transactionsPut: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  let authId: string;

  try {
    const authService = new AuthService();
    authId = await authService.getAuthId(event);
  } catch (error) {
    errorLogger("Handler/Transactions:Put", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 401,
      body: "Unauthorized"
    });

    callback(null, response);
    return;
  }

  let transaction: Transaction;
  try {
    const { body: rawBody } = event;
    const body = JSON.parse(rawBody);
    transaction = new Transaction({
      ...body
    });
    const requestVerificationService = new RequestVerificationService();
    requestVerificationService.verifyTransaction(transaction);
  } catch (error) {
    errorLogger("Handler/Transactions:Put", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 400,
      body: "Bad request"
    });
    callback(null, response);
    return;
  }

  try {
    const transactionService = new TransactionService();
    await transactionService.updateTransaction(authId, transaction);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 200,
      body: transaction
    });

    callback(null, response);
  } catch (error) {
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 500,
      body: undefined
    });
    callback(null, response);
  }
};

export { transactionsPut };
