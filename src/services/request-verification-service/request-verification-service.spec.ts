import { RequestVerificationService } from "./index";
import { transactions } from "../../mocks/transactions";
import { Transaction } from "../../models/transaction";

describe("services/RequestVerificationService", () => {
  let requestVerificationService: RequestVerificationService;
  let transaction: Transaction;

  beforeEach(() => {
    requestVerificationService = new RequestVerificationService();
    // eslint-disable-next-line prefer-destructuring
    transaction = { ...transactions[0] };
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof RequestVerificationService).toEqual("function");
    expect(typeof requestVerificationService).toEqual("object");
  });

  describe("when verifying a transaction", () => {
    describe("and there are attributes that are empty", () => {
      it("should throw the correct error", () => {
        expect.assertions(1);

        try {
          transaction.amount = undefined;
          requestVerificationService.verifyTransaction(transaction);
        } catch (error) {
          expect(error.message).toEqual("Transaction has undefined attributes");
        }
      });
    });

    describe("and there are attributes that are NOT empty", () => {
      it("should NOT throw any errors", () => {
        try {
          requestVerificationService.verifyTransaction(transaction);
        } catch (error) {
          throw new Error("Test has failed!");
        }
      });
    });

    describe("and there are attribute arrays that are empty", () => {
      it("should NOT throw any errors", () => {
        try {
          requestVerificationService.verifyTransaction(transaction);
        } catch (error) {
          throw new Error("Test has failed!");
        }
      });
    });

    describe("and there are attribute arrays that are NOT empty", () => {
      it("should throw the correct error", () => {
        expect.assertions(1);

        try {
          transaction.transCategoryIds = [];
          requestVerificationService.verifyTransaction(transaction);
        } catch (error) {
          expect(error.message).toEqual(
            "Transaction has empty attribute arrays"
          );
        }
      });
    });
  });
});
