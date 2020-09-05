import { TransactionService } from "./index";
import { rawTransactions } from "../../mocks/raw-transactions";
import { transactions } from "../../mocks/transactions";

let mockRead: jest.Mock;

jest.mock("../../services/database-service", () => {
  return {
    DatabaseService: jest.fn().mockImplementation(() => ({
      read: mockRead
    }))
  };
});

describe("services/TransactionService", () => {
  let transactionService: TransactionService;
  let consoleLog: any;
  let returnedTransactions: any[];

  beforeEach(() => {
    consoleLog = console.log;
    transactionService = new TransactionService();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it("should be a class", () => {
    expect(typeof TransactionService).toEqual("function");
    expect(typeof transactionService).toEqual("object");
  });

  describe("when instantiated", () => {
    it("should create a new database service instance", () => {
      expect(transactionService["databaseService"]).toBeDefined();
    });
  });

  describe("when transactions are queried", () => {
    describe("and the call is successful", () => {
      beforeEach(async () => {
        mockRead = jest.fn().mockResolvedValue(rawTransactions);
        transactionService = new TransactionService();
        returnedTransactions = await transactionService.getTransactions(
          "mock-user-id"
        );
      });

      it("should call the database service with correct parameters", () => {
        expect(transactionService["databaseService"].read).toHaveBeenCalledWith(
          "userId",
          "mock-user-id",
          "transactions"
        );
      });

      it("should return the correct transactions", () => {
        expect(returnedTransactions).toEqual(transactions);
      });
    });

    describe("and the call is NOT successful", () => {
      const expectedError = "mock-error";

      beforeEach(async () => {
        mockRead = jest.fn().mockRejectedValue(expectedError);
        transactionService = new TransactionService();
        returnedTransactions = await transactionService.getTransactions(
          "mock-user-id"
        );
      });

      it("should call the database service with correct parameters", () => {
        expect(transactionService["databaseService"].read).toHaveBeenCalledWith(
          "userId",
          "mock-user-id",
          "transactions"
        );
      });

      it("should return the correct user", () => {
        expect(returnedTransactions).toEqual([]);
      });

      it("should log correct messages to the console", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: TransactionService");
        expect(console.log).toHaveBeenCalledWith(expectedError);
      });
    });
  });
});
