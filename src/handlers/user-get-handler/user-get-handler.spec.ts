import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { errorLogger } from "../../utils/error-logger";

let mockGetAuthId: jest.Mock;
let mockGetUser: jest.Mock;

jest.mock("../../services/auth-service", () => ({
  AuthService: jest.fn(() => ({
    getAuthId: mockGetAuthId
  }))
}));

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    getUser: mockGetUser
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("handlers/user-get", () => {
  let callback: Callback<APIGatewayProxyResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
  });

  describe("when a user is requested", () => {
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
          "Handler/UserGet",
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
      beforeEach(async () => {
        mockGetAuthId = jest.fn().mockResolvedValue("mock-auth-id");
      });

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
