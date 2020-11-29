import axios from "axios";
import { TOKEN_VALIDATION_URL } from "../../config";
import { errorLogger } from "../../utils/error-logger";
import { isStringEmpty } from "../../utils/string-utils";

class AuthService {
  async getAuthId(authHeader: string): Promise<string> {
    isStringEmpty(authHeader);

    const [, token] = authHeader.split(" ");
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
