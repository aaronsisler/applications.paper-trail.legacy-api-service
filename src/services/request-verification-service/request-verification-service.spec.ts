import { RequestVerificationService } from "./index";
import { transactions } from "../../mocks/transactions";
import { userDetails } from "../../mocks/user-details";
import { Transaction } from "../../models/transaction";
import { User } from "../../models/user";

describe("services/RequestVerificationService", () => {
  let requestVerificationService: RequestVerificationService;

  beforeEach(() => {
    requestVerificationService = new RequestVerificationService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof RequestVerificationService).toEqual("function");
    expect(typeof requestVerificationService).toEqual("object");
  });

  describe("when verifying a transaction", () => {
    let transaction: Transaction;

    beforeEach(() => {
      // eslint-disable-next-line prefer-destructuring
      transaction = { ...transactions[0] };
    });

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

  describe("when verifying a user", () => {
    let user: User;

    beforeEach(() => {
      user = { ...userDetails };
    });

    describe("and there are attributes that are empty", () => {
      it("should throw the correct error", () => {
        expect.assertions(1);

        try {
          user.lastName = undefined;
          requestVerificationService.verifyUser(user);
        } catch (error) {
          expect(error.message).toEqual("User has undefined attributes");
        }
      });
    });

    describe("and there are attributes that are NOT empty", () => {
      it("should NOT throw any errors", () => {
        try {
          requestVerificationService.verifyUser(user);
        } catch (error) {
          throw new Error("Test has failed!");
        }
      });
    });
  });
});
