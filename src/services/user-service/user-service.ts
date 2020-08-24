import { User } from "../../models/user";
import { DatabaseService } from "../database-service";
import { DatabaseItem } from "../../models/database-item";
import { DatabaseTypes } from "../../constants";

class UserService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async getUser(userId: string): Promise<User> {
    let user: User;
    try {
      const {
        userDetails: rawUser
      }: DatabaseItem = await this.databaseService.getItem(
        "userId",
        userId,
        "userDetails"
      );
      user = this.mapRawUser(rawUser[DatabaseTypes.OBJECT], userId);
      return user;
    } catch (error) {
      console.log("ERROR: UserService");
      console.log(error);
    }

    return user;
  }

  private mapRawUser(rawUser: DatabaseItem, userId: string): User {
    const user: User = new User({
      firstName: rawUser.firstName["S"],
      lastName: rawUser.lastName["S"],
      userId
    });

    return user;
  }
}

export { UserService };
