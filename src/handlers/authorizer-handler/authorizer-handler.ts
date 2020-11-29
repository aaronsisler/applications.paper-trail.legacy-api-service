/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Callback, Context } from "aws-lambda";
import { AuthService } from "../../services/auth-service";
import { errorLogger } from "../../utils/error-logger";
import { generateAuthPolicy } from "../../utils/generate-auth-policy";

// A simple token-based authorizer example to demonstrate how to use an authorization token
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
// the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
// string, the authorizer function returns an HTTP 401 status code. For any other token value,
// the authorizer returns an HTTP 500 status code.
// Note that token values are case-sensitive.
const authorizer = async (
  event: any,
  _context: Context,
  callback: Callback<any>
): Promise<void> => {
  let principalId: string;

  try {
    const authService = new AuthService();
    principalId = await authService.getAuthId(event.authorizationToken);
  } catch (error) {
    errorLogger("Handler/Authorizer", error);
    callback("Unauthorized");
    return;
  }

  callback(null, generateAuthPolicy(principalId, "Allow", event.methodArn));
};

export { authorizer };
