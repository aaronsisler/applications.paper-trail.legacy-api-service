import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import * as authIdUtil from "../../utils/auth-id-util";
import { errorLogger } from "../../utils/error-logger";

let mockGetUser: jest.Mock;

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    getUser: mockGetUser
  }))
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

describe("Handlers/User:Get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    const mockGetAuthId = jest.spyOn(authIdUtil, "getAuthId");
    mockGetAuthId.mockImplementation(() => "mock-auth-id");
    event = { requestContext: { authorizer: { principalId: "mock-auth-id" } } };
  });

  describe("when a user is requested", () => {
    describe("and when authentication is NOT successful", () => {
      const expectedResponse = {
        statusCode: 401,
        body: "Unauthorized"
      };

      beforeEach(async () => {
        event = {
          requestContext: { authorizer: { principalId: "taco" } }
        };
        const mockGetAuthId = jest.spyOn(authIdUtil, "getAuthId");
        mockGetAuthId.mockImplementation(() => {
          throw new Error("mock-error");
        });
        await handler(event, undefined, callback);
      });

      it("should verify the request correctly", () => {
        expect(authIdUtil.getAuthId).toHaveBeenCalledWith(event);
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/User:Get",
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
      describe("and a user is found", () => {
        beforeEach(async () => {
          mockGetUser = jest.fn().mockResolvedValue("mock-user");
          await handler(event, undefined, callback);
        });

        it("should have fetched user correctly", async () => {
          expect(mockGetUser).toHaveBeenCalledWith("mock-auth-id");
        });

        it("should return the correct response", () => {
          expect(responseBodyBuilder).toHaveBeenCalledWith({
            statusCode: 200,
            body: "mock-user"
          });
        });

        it("should invoke the callback correctly", () => {
          expect(callback).toHaveBeenCalledWith(
            null,
            "mock-body-built-response"
          );
        });
      });

      describe("and a user is NOT found", () => {
        beforeEach(async () => {
          mockGetUser = jest.fn().mockRejectedValue("user-not-found");
          await handler(event, undefined, callback);
        });

        it("should have fetched user correctly", async () => {
          expect(mockGetUser).toHaveBeenCalledWith("mock-auth-id");
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
