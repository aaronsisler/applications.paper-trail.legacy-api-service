import { DatabaseService } from "../database-service";

class TransactionService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }
}

export { TransactionService };
