import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HandlerResponse } from "../../models/handler-response";
import { Transaction } from "../../models/transaction";
import { RequestVerificationService } from "../../services/request-verification-service";
import { TransactionService } from "../../services/transaction-service";
import { getAuthId } from "../../utils/auth-id-util";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const transactionsPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  let authId: string;

  try {
    authId = getAuthId(event);
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
    transaction = new Transaction({
      ...body
    });

    const requestVerificationService = new RequestVerificationService();
    requestVerificationService.verifyTransaction(transaction);
  } catch (error) {
    errorLogger("Handler/Transactions:Post", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 400,
      body: "Bad request"
    });
    callback(null, response);
    return;
  }

  try {
    const transactionService = new TransactionService();
    await transactionService.createTransaction(authId, transaction);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 201,
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

export { transactionsPost };
