import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HandlerResponse } from "../../models/handler-response";
import { User } from "../../models/user";
import { AuthService } from "../../services/auth-service";
import { RequestVerificationService } from "../../services/request-verification-service";
import { UserService } from "../../services/user-service";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { errorLogger } from "../../utils/error-logger";

const userPost: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  let authId: string;

  try {
    const authService = new AuthService();
    authId = await authService.getAuthId(event);
  } catch (error) {
    errorLogger("Handler/User:Post", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 401,
      body: "Unauthorized"
    });

    callback(null, response);
    return;
  }

  let user: User;
  try {
    const { body: rawBody } = event;
    const body = JSON.parse(rawBody);
    user = new User({
      ...body,
      userId: authId
    });

    const requestVerificationService = new RequestVerificationService();
    requestVerificationService.verifyUser(user);
  } catch (error) {
    errorLogger("Handler/User:Post", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 400,
      body: "Bad request"
    });
    callback(null, response);
    return;
  }

  try {
    const userService = new UserService();
    await userService.createUser(user);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 201,
      body: user
    });

    callback(null, response);
  } catch (error) {
    errorLogger("Handler/User:Post", error);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 500,
      body: undefined
    });

    callback(null, response);
  }
};

export { userPost };
