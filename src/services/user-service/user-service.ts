import { User } from "../../models/user";
import { DatabaseService } from "../database-service";
import { DatabaseItem } from "../../models/database-item";
import { errorLogger } from "../../utils/error-logger";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getUserDetails(userId: string): Promise<User> {
    let user: User;
    try {
      const {
        userDetails: rawUser
      }: DatabaseItem = await this.databaseService.read(
        "userId",
        userId,
        "userDetails"
      );
      return { userId, ...(rawUser as User) };
    } catch (error) {
      errorLogger(UserService.name, error);
    }

    return user;
  }
}

export { UserService };
