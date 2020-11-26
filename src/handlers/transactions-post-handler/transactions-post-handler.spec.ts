import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { rawTransactions } from "../../mocks/raw-transactions";
import { transactions } from "../../mocks/transactions";

let mockGetAuthId: jest.Mock;
let mockCreateTransaction: jest.Mock;
let mockVerifyTransaction: jest.Mock;

jest.mock("../../services/auth-service", () => ({
  AuthService: jest.fn(() => ({
    getAuthId: mockGetAuthId
  }))
}));

jest.mock("../../services/request-verification-service", () => ({
  RequestVerificationService: jest.fn(() => ({
    verifyTransaction: mockVerifyTransaction
  }))
}));

jest.mock("../../services/transaction-service", () => ({
  TransactionService: jest.fn(() => ({
    createTransaction: mockCreateTransaction
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("Handlers/Transactions:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockCreateTransaction = jest.fn().mockResolvedValue(undefined);
    mockVerifyTransaction = jest.fn();
    event = {
      body: JSON.stringify(rawTransactions[0])
    };
  });

  describe("when a transaction is to be created", () => {
    describe("and when authentication is NOT successful", () => {
      const expectedResponse = {
        statusCode: 401,
        body: "Unauthorized"
      };

      beforeEach(async () => {
        mockGetAuthId = jest.fn().mockRejectedValue("mock-error");
        await handler(event, undefined, callback);
      });

      it("should verify the request correctly", () => {
        expect(mockGetAuthId).toHaveBeenCalledWith(event);
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/Transactions:Post",
          "mock-error"
        );
      });

      it("should return the correct response", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith(expectedResponse);
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("and when authentication is successful", () => {
      beforeEach(() => {
        mockGetAuthId = jest.fn().mockResolvedValue("mock-auth-id");
      });

      describe("and when request is NOT valid", () => {
        beforeEach(async () => {
          mockVerifyTransaction = jest.fn(() => {
            throw new Error();
          });
          await handler(event, undefined, callback);
        });

        it("should return the correct response", () => {
          expect(responseBodyBuilder).toHaveBeenCalledWith({
            statusCode: 400,
            body: "Bad request"
          });
        });

        it("should invoke the callback correctly", () => {
          expect(callback).toHaveBeenCalledWith(
            null,
            "mock-body-built-response"
          );
        });
      });

      describe("and when request is valid", () => {
        describe("and when transaction is created", () => {
          beforeEach(async () => {
            mockCreateTransaction = jest.fn().mockResolvedValue(undefined);
            await handler(event, undefined, callback);
          });

          it("should attempt to create transaction correctly", async () => {
            expect(mockCreateTransaction).toHaveBeenCalledWith(
              "mock-auth-id",
              rawTransactions[0]
            );
          });

          it("should return the correct response", () => {
            expect(responseBodyBuilder).toHaveBeenCalledWith({
              statusCode: 201,
              body: transactions[0]
            });
          });

          it("should invoke the callback correctly", () => {
            expect(callback).toHaveBeenCalledWith(
              null,
              "mock-body-built-response"
            );
          });
        });

        describe("and when transaction is NOT created", () => {
          beforeEach(async () => {
            mockCreateTransaction = jest.fn().mockRejectedValue(undefined);
            await handler(event, undefined, callback);
          });

          it("should attempt to create transaction correctly", async () => {
            expect(mockCreateTransaction).toHaveBeenCalledWith(
              "mock-auth-id",
              rawTransactions[0]
            );
          });

          it("should return the correct response", () => {
            expect(responseBodyBuilder).toHaveBeenCalledWith({
              statusCode: 500,
              body: undefined
            });
          });

          it("should invoke the callback correctly", () => {
            expect(callback).toHaveBeenCalledWith(
              null,
              "mock-body-built-response"
            );
          });
        });
      });
    });
  });
});
