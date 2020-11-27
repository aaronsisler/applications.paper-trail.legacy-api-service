import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HandlerResponse } from "../../models/handler-response";
import { User } from "../../models/user";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { UserService } from "../../services/user-service";
import { errorLogger } from "../../utils/error-logger";
import { getAuthId } from "../../utils/auth-id-util";

const userGet: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    const authId = getAuthId(event);
    const userService = new UserService();
    const user: User = await userService.getUser(authId);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 200,
      body: user
    });

    callback(null, response);
    return;
  } catch (error) {
    errorLogger("Handler/User:Get", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 204,
      body: undefined
    });

    callback(null, response);
  }
};

export { userGet };
