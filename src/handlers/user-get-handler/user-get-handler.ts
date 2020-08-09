import { HandlerResponse } from "../../models/handler-response";
import { User } from "../../models/user";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { AuthService } from "../../services/auth-service";
import { UserService } from "../../services/user-service";

const userGet = async (event: any, _context: any, callback: any) => {
  try {
    const authService = new AuthService();
    const authId: string = await authService.getAuthId(event);
    if (!authId) {
      const response: HandlerResponse = responseBodyBuilder({
        statusCode: 401,
        body: "Error: Unauthenticated user"
      });

      return callback(null, response);
    }

    const userService = new UserService();
    const user: User = await userService.getUser(authId);

    const response: HandlerResponse = responseBodyBuilder({
      statusCode: user ? 200 : 204,
      body: user
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

export { userGet };
