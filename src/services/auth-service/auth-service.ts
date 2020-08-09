import axios from "axios";

import { TOKEN_HEADER, TOKEN_VALIDATION_URL } from "../../config";

class AuthService {
  constructor() {}

  async getAuthId(req: any): Promise<string> {
    const token = req.headers[TOKEN_HEADER];
    const returnedObject = await this.extractTokenValues(token);

    return returnedObject;
  }

  private async extractTokenValues(token: string) {
    let result: string;

    try {
      const { data } = await axios.get(TOKEN_VALIDATION_URL, {
        params: {
          id_token: token
        }
      });

      result = data["sub"];
    } catch (error) {
      console.log("ERROR: AuthService"); // TODO figure out AWS logging
      console.log(error);
    }

    return result;
  }
}

export { AuthService };
