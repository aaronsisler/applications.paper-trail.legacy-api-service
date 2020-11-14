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
import { AuthService } from "../../services/auth-service";
import { UserService } from "../../services/user-service";

const userGet: APIGatewayProxyHandler = async (
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

    const userService = new UserService();
    const user: User = await userService.getUserDetails(authId);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: user ? 200 : 204,
      body: user
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

export { userGet };
