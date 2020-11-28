import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { rawUserDetails } from "../../mocks/raw-user-details";
import * as authIdUtil from "../../utils/auth-id-util";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockUpdateUser: jest.Mock;
let mockVerifyUser: jest.Mock;

jest.mock("../../services/request-verification-service", () => ({
  RequestVerificationService: jest.fn(() => ({
    verifyUser: mockVerifyUser
  }))
}));

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    updateUser: mockUpdateUser
  }))
}));

jest.mock("../../utils/error-logger");

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

describe("Handlers/User:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;
  let mockGetAuthId: jest.SpyInstance;

  beforeEach(async () => {
    callback = jest.fn();
    mockUpdateUser = jest.fn().mockResolvedValue(undefined);
    mockVerifyUser = jest.fn();
    mockGetAuthId = jest.spyOn(authIdUtil, "getAuthId");
    mockGetAuthId.mockImplementation(() => "mock-auth-id");
  });

  describe("when a user is to be ypdated", () => {
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
          "Handler/User:Put",
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
      describe("and when request is NOT valid", () => {
        beforeEach(async () => {
          mockVerifyUser = jest.fn(() => {
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
        beforeEach(() => {
          event = {
            body: JSON.stringify(rawUserDetails)
          };
        });

        describe("and when user is updated", () => {
          beforeEach(async () => {
            await handler(event, undefined, callback);
          });

          it("should attempt to update user correctly", async () => {
            expect(mockUpdateUser).toHaveBeenCalledWith({
              ...rawUserDetails,
              userId: "mock-auth-id"
            });
          });

          it("should return the correct response", () => {
            expect(responseBodyBuilder).toHaveBeenCalledWith({
              statusCode: 200,
              body: {
                ...rawUserDetails,
                userId: "mock-auth-id"
              }
            });
          });

          it("should invoke the callback correctly", () => {
            expect(callback).toHaveBeenCalledWith(
              null,
              "mock-body-built-response"
            );
          });
        });

        describe("and when user is NOT updated", () => {
          beforeEach(async () => {
            mockUpdateUser = jest.fn().mockRejectedValue(undefined);
            await handler(event, undefined, callback);
          });

          it("should attempt to update user correctly", async () => {
            expect(mockUpdateUser).toHaveBeenCalledWith({
              ...rawUserDetails,
              userId: "mock-auth-id"
            });
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
