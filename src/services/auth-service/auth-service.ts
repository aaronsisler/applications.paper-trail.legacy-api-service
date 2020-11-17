import axios from "axios";
import { HandlerRequest } from "../../models/handler-request";
import { errorLogger } from "../../utils/error-logger";
import { TOKEN_VALIDATION_URL } from "../../config";

class AuthService {
  async getAuthId(authRequest: HandlerRequest): Promise<string> {
    let authHeader: string;
    let token: string;

    try {
      authHeader = authRequest.headers.Authorization as string;
      [, token] = authHeader.split(" ");
    } catch (error) {
      errorLogger("AuthService", "No token found in headers");
      throw new Error("No token found in headers");
    }

    if (!token) {
      errorLogger("AuthService", "Token cannot be empty");
      throw new Error("Token cannot be empty");
    }

    try {
      return await this.extractTokenValue(token);
    } catch (error) {
      errorLogger("AuthService", "OAuth token not valid");
      throw new Error("OAuth token not valid");
    }
  }

  private extractTokenValue = async (token: string) => {
    const { data } = await axios.get(TOKEN_VALIDATION_URL, {
      params: {
        id_token: token
      }
    });

    return data.sub;
  };
}

export { AuthService };
