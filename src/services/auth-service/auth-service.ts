import axios from "axios";
import { errorLogger } from "../../utils/error-logger";
import { TOKEN_HEADER, TOKEN_VALIDATION_URL } from "../../config";

class AuthService {
  async getAuthId(req: any): Promise<string> {
    let authHeader: string;
    let token: string;
    let authId: string;

    try {
      authHeader = req.headers[TOKEN_HEADER];
      [, token] = authHeader.split(" ");
    } catch (error) {
      errorLogger("AuthService", "No token found in headers");
      return authId;
    }

    if (!token) {
      errorLogger("AuthService", "No token found in headers");
      return authId;
    }

    try {
      authId = await this.extractTokenValue(token);
    } catch (error) {
      errorLogger("AuthService", "OAuth token not valid");
    }

    return authId;
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
