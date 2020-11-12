import { TransactionService } from "./index";
import { rawTransactions } from "../../mocks/raw-transactions";
import { transactions } from "../../mocks/transactions";
import { errorLogger } from "../../utils/error-logger";
import { Transaction } from "../../models/transaction";

let mockRead: jest.Mock;

jest.mock("../../services/database-service", () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    read: mockRead
  }))
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("services/TransactionService", () => {
  let transactionService: TransactionService;
  let returnedTransactions: Transaction[];

  beforeEach(() => {
    transactionService = new TransactionService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof TransactionService).toEqual("function");
    expect(typeof transactionService).toEqual("object");
  });

  describe("when transactions are requested", () => {
    describe("and the call is successful", () => {
      beforeEach(async () => {
        mockRead = jest.fn().mockResolvedValue(rawTransactions);
        transactionService = new TransactionService();
        returnedTransactions = await transactionService.getTransactions(
          "mock-user-id"
        );
      });

      it("should read from the database using the correct parameters", () => {
        expect(mockRead).toHaveBeenCalledWith(
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

      it("should read from the database using the correct parameters", () => {
        expect(mockRead).toHaveBeenCalledWith(
          "userId",
          "mock-user-id",
          "transactions"
        );
      });

      it("should return the correct user", () => {
        expect(returnedTransactions).toEqual([]);
      });

      it("should log correct messages to the console", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "TransactionService",
          expectedError
        );
      });
    });
  });
});
