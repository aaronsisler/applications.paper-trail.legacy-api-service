import { ItemList } from "aws-sdk/clients/dynamodb";

import { DATABASE_TABLE_USERS } from "../../config";
import { DatabaseItem } from "../../models/database-item";
import { KeyValuePair } from "../../models/key-value-pair";
import { User } from "../../models/user";
import { DatabaseService } from "../database-service";
import { errorLogger } from "../../utils/error-logger";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async createUser(user: User): Promise<void> {
    try {
      const key = new KeyValuePair("userId", user.userId);
      await this.databaseService.create(
        DATABASE_TABLE_USERS,
        key,
        (user as unknown) as DatabaseItem
      );
    } catch (error) {
      errorLogger(UserService.name, error);
      throw new Error("User not created");
    }
  }

  async getUser(userId: string): Promise<User> {
    try {
      const filterCondition = new KeyValuePair("userId", userId);
      const rawUserList: ItemList = await this.databaseService.read(
        DATABASE_TABLE_USERS,
        filterCondition
      );
      const userList: User[] = (rawUserList as unknown) as User[];

      if (userList.length === 0) {
        throw new Error("User not found");
      }

      return userList[0];
    } catch (error) {
      errorLogger(UserService.name, error);
      throw new Error("User not found");
    }
  }
}

export { UserService };
