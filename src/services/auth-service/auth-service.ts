import axios from "axios";

import { TOKEN_HEADER, TOKEN_VALIDATION_URL } from "../../config";

class AuthService {
  constructor() {}

  async getAuthId(req: any): Promise<string> {
    let authHeader: string;
    let token: string;
    let authId: string;

    try {
      authHeader = req.headers[TOKEN_HEADER];
    } catch (error) {
      console.log("ERROR: AuthService");
      console.log("No token found in headers");
      return authId;
    }

    try {
      [, token] = authHeader.split(" ");
    } catch (error) {
      console.log("Here");
      console.log("ERROR: AuthService");
      console.log("Token not correct format in header");
      return authId;
    }

    if (!token) {
      console.log("ERROR: AuthService");
      console.log("No token found in headers");
      return authId;
    }

    try {
      authId = await this.extractTokenValue(token);
    } catch (error) {
      console.log("ERROR: AuthService");
      console.log("OAuth token not valid");
    }

    return authId;
  }

  private async extractTokenValue(token: string) {
    let result: string;

    const { data } = await axios.get(TOKEN_VALIDATION_URL, {
      params: {
        id_token: token
      }
    });

    result = data["sub"];

    return result;
  }
}

export { AuthService };
