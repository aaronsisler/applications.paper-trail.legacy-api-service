import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";

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

describe("handlers/transactions-get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
  });

  describe("when authentication is NOT successful", () => {
    const expectedResponse = {
      statusCode: 401,
      body: "Unauthorized"
    };

    beforeEach(async () => {
      mockGetAuthId = jest.fn().mockResolvedValue(undefined);
      await handler(event, undefined, callback);
    });

    it("should call the auth service with correct event", () => {
      expect(mockGetAuthId).toHaveBeenCalledWith(event);
    });

    it("should call the response body builder with the correct parameters", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(expectedResponse);
    });

    it("should invoke the callback with the correct response", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });

  describe("when authentication is successful", () => {
    beforeEach(() => {
      mockGetAuthId = jest.fn().mockResolvedValue("mock-auth-id");
      mockGetTransactions = jest.fn();
    });

    it("should call transaction service with correct arguments", async () => {
      await handler(event, undefined, callback);

      expect(mockGetTransactions).toHaveBeenCalledWith("mock-auth-id");
    });

    describe("when fetched transactions are found", () => {
      beforeEach(async () => {
        mockGetTransactions = jest.fn().mockResolvedValue("mock-transactions");
        await handler(event, undefined, callback);
      });

      it("should call the response body builder with the correct parameters", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith({
          statusCode: 200,
          body: "mock-transactions"
        });
      });

      it("should invoke the callback with the correct response", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("when fetched transactions are NOT found", () => {
      beforeEach(async () => {
        mockGetTransactions = jest.fn().mockResolvedValue([]);
        await handler(event, undefined, callback);
      });

      it("should call the response body builder with the correct parameters", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith({
          statusCode: 200,
          body: []
        });
      });

      it("should invoke the callback with the correct response", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });
  });

  describe("when an error is thrown", () => {
    beforeEach(async () => {
      mockGetAuthId = jest.fn().mockRejectedValue({});
      await handler(event, undefined, callback);
    });

    it("should call response body builder with correct arguments", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith({
        statusCode: 500,
        body: "Error: Something went wrong"
      });
    });

    it("should invoke callback with correct arguments", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
    });
  });
});
