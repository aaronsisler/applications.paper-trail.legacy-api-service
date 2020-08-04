import { HandlerResponse } from "../../models/handler-response";
import { User } from "../../models/user";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { UserService } from "../../services/user-service";

const userGet = async (event: any, _context: any, callback: any) => {
  try {
    const userService = new UserService();
    const userId = event["pathParameters"]["userId"];
    const user: User = await userService.getUser(userId);
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 200,
      body: user
    });

    callback(null, response);
  } catch (error) {
    const response: HandlerResponse = responseBodyBuilder({
      statusCode: 500,
      body: "Something went wrong"
    });
    callback(response);
  }
};

export { userGet };
