import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { rawUserDetails } from "../../mocks/raw-user-details";

let mockGetAuthId: jest.Mock;
let mockCreateUser: jest.Mock;
let mockVerifyUser: jest.Mock;

jest.mock("../../services/auth-service", () => ({
  AuthService: jest.fn(() => ({
    getAuthId: mockGetAuthId
  }))
}));

jest.mock("../../services/request-verification-service", () => ({
  RequestVerificationService: jest.fn(() => ({
    verifyUser: mockVerifyUser
  }))
}));

jest.mock("../../services/user-service", () => ({
  UserService: jest.fn(() => ({
    createUser: mockCreateUser
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn(() => "mock-body-built-response")
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("Handlers/User:Post", () => {
  let callback: Callback<APIGatewayProxyResult>;
  let event: any;

  beforeEach(async () => {
    callback = jest.fn();
    mockCreateUser = jest.fn().mockResolvedValue(undefined);
    mockVerifyUser = jest.fn();
  });

  describe("when a user is to be created", () => {
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
          "Handler/User:Post",
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

        describe("and when user is created", () => {
          beforeEach(async () => {
            await handler(event, undefined, callback);
          });

          it("should attempt to create user correctly", async () => {
            expect(mockCreateUser).toHaveBeenCalledWith({
              ...rawUserDetails,
              userId: "mock-auth-id"
            });
          });

          it("should return the correct response", () => {
            expect(responseBodyBuilder).toHaveBeenCalledWith({
              statusCode: 201,
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

        describe("and when user is NOT created", () => {
          beforeEach(async () => {
            mockCreateUser = jest.fn().mockRejectedValue(undefined);
            await handler(event, undefined, callback);
          });

          it("should attempt to create user correctly", async () => {
            expect(mockCreateUser).toHaveBeenCalledWith({
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
