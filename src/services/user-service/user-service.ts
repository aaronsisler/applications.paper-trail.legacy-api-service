import { User } from "../../models/user";
import { DatabaseService } from "../database-service";
import { DatabaseItem } from "../../models/database-item";

class UserService {
  private databaseService: DatabaseService;

  constructor(databaseService?: DatabaseService) {
    this.databaseService = databaseService
      ? databaseService
      : new DatabaseService();
  }

  async getUser(userId: string): Promise<User> {
    let user: User;
    try {
      const rawUser: DatabaseItem = await this.databaseService.getItem(
        "userId",
        userId
      );
      user = this.mapRawUser(rawUser);
      return user;
    } catch (error) {
      console.log("ERROR: UserService"); // TODO figure out AWS logging
      console.log(error);
    }

    return user;
  }

  private mapRawUser(rawUser: DatabaseItem): User {
    const user: User = new User({
      firstName: rawUser.firstName["S"],
      lastName: rawUser.lastName["S"],
      userId: rawUser.userId["S"]
    });

    return user;
  }
}

export { UserService };
