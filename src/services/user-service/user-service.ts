import { User } from "../../models/user";
import { DATABASE_TABLE_USERS } from "../../config";
import { DatabaseService } from "../database-service";
import { DatabaseItem } from "../../models/database-item";
import { errorLogger } from "../../utils/error-logger";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getUser(userId: string): Promise<User> {
    try {
      const key = { userId };
      const rawUser: DatabaseItem = await this.databaseService.read(
        DATABASE_TABLE_USERS,
        key
      );
      return { userId, ...rawUser } as User;
    } catch (error) {
      errorLogger(UserService.name, error);
      throw new Error("User not found");
    }
  }
}

export { UserService };
