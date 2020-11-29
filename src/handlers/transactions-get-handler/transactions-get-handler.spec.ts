import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import * as authIdUtil from "../../utils/auth-id-util";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetTransactions: jest.Mock;

jest.mock("../../services/transaction-service", () => ({
  TransactionService: jest.fn(() => ({
    getTransactions: mockGetTransactions
  }))
}));

jest.mock("../../utils/error-logger");

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

describe("handlers/transactions-get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;
  let mockGetAuthId: jest.SpyInstance;

  beforeEach(async () => {
    callback = jest.fn();
    mockGetTransactions = jest.fn();
    mockGetAuthId = jest.spyOn(authIdUtil, "getAuthId");
    mockGetAuthId.mockImplementation(() => "mock-auth-id");
  });

  describe("when transactions are requested", () => {
    describe("and when authentication is NOT successful", () => {
      const expectedResponse = {
        statusCode: 401,
        body: "Unauthorized"
      };

      beforeEach(async () => {
        mockGetAuthId.mockImplementation(() => {
          throw new Error("mock-error");
        });
        await handler(event, undefined, callback);
      });

      it("should verify the request correctly", () => {
        expect(mockGetAuthId).toHaveBeenCalledWith(event);
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/Transactions:Get",
          Error("mock-error")
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
