import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { HandlerResponse } from "../../models/handler-response";
import { Transaction } from "../../models/transaction";
import { AuthService } from "../../services/auth-service";
import { TransactionService } from "../../services/transaction-service";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const transactionsPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  let authId: string;

  try {
    const authService = new AuthService();
    authId = await authService.getAuthId(event);
  } catch (error) {
    errorLogger("Handler/Transactions:Post", error);
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
    const transactionId = uuidv4();
    transaction = new Transaction({
      ...body,
      transactionId
    });
  } catch (error) {
    errorLogger("Handler/Transactions:Post", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 400,
      body: "Bad request"
    });
    callback(null, response);
  }

  try {
    const transactionService = new TransactionService();
    await transactionService.createTransaction(authId, transaction);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 204,
      body: undefined
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

export { transactionsPost };
