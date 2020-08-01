import { SuccessResponse } from "../../models/success-response";
import { User } from "../../models/user";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { UserService } from "../../services/user-service";

const userGet = async (_event: any, _context: any, callback: any) => {
  const userService = new UserService();
  const user: User = await userService.getUser("123");
  const response: SuccessResponse = responseBodyBuilder({
    statusCode: 200,
    body: user
  });

  callback(null, response);
};

export { userGet };
