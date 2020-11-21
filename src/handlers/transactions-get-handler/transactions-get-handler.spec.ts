import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { errorLogger } from "../../utils/error-logger";

let mockGetAuthId: jest.Mock;
let mockGetTransactions: jest.Mock;

jest.mock("../../services/auth-service", () => ({
  AuthService: jest.fn(() => ({
    getAuthId: mockGetAuthId
  }))
}));

jest.mock("../../services/transaction-service", () => ({
  TransactionService: jest.fn(() => ({
    getTransactions: mockGetTransactions
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("handlers/transactions-get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
  });

  describe("when transactions are requested", () => {
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
          "Handler/Transactions:Get",
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
        mockGetTransactions = jest.fn();
      });

      describe("and when transactions are found", () => {
        beforeEach(async () => {
          mockGetTransactions = jest
            .fn()
            .mockResolvedValue("mock-transactions");
          await handler(event, undefined, callback);
        });

        it("should have fetched transactions correctly", async () => {
          expect(mockGetTransactions).toHaveBeenCalledWith("mock-auth-id");
        });

        it("should return the correct response", () => {
          expect(responseBodyBuilder).toHaveBeenCalledWith({
            statusCode: 200,
            body: "mock-transactions"
          });
        });

        it("should invoke the callback correctly", () => {
          expect(callback).toHaveBeenCalledWith(
            null,
            "mock-body-built-response"
          );
        });
      });

      describe("and when transactions are NOT found", () => {
        beforeEach(async () => {
          mockGetTransactions = jest
            .fn()
            .mockRejectedValue("transactions-not-found");
          await handler(event, undefined, callback);
        });

        it("should have fetched transactions correctly", async () => {
          expect(mockGetTransactions).toHaveBeenCalledWith("mock-auth-id");
        });

        it("should return the correct response", () => {
          expect(responseBodyBuilder).toHaveBeenCalledWith({
            statusCode: 204,
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
