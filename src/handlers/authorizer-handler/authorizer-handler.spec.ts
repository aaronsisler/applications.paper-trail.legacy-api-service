import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { errorLogger } from "../../utils/error-logger";
import * as generateAutoUtil from "../../utils/generate-auth-policy";

let mockGetAuthId: jest.Mock;

jest.mock("../../services/auth-service", () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    getAuthId: mockGetAuthId
  }))
}));

jest.mock("../../utils/error-logger");

jest.mock("../../utils/generate-auth-policy");

describe("Handlers/Authorizer", () => {
  it("should be the correct type", () => {
    expect(typeof handler).toEqual("function");
  });

  describe("when handler is invoked", () => {
    const event: any = {
      authorizationToken: "mock-auth-token",
      methodArn: "mock-method-arn"
    };
    let callback: Callback<APIGatewayProxyResult>;
    let mockGenerateAuthPolicy: jest.SpyInstance;

    beforeEach(() => {
      mockGenerateAuthPolicy = jest.spyOn(
        generateAutoUtil,
        "generateAuthPolicy"
      );
      mockGenerateAuthPolicy.mockImplementation(
        () => "mock-generate-auth-policy"
      );
      callback = jest.fn();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    describe("and when authentication is NOT successful", () => {
      beforeEach(async () => {
        mockGetAuthId = jest.fn().mockRejectedValue("auth-not-found");
        await handler(event, undefined, callback);
      });

      it("should have fetched authentication id correctly", async () => {
        expect(mockGetAuthId).toHaveBeenCalledWith("mock-auth-token");
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "Handler/Authorizer",
          "auth-not-found"
        );
      });

      it("should invoke the callback correctly", () => {
        expect(callback).toHaveBeenCalledWith("Unauthorized");
      });
    });

    describe("and when authentication is successful", () => {
      beforeEach(async () => {
        mockGetAuthId = jest.fn().mockResolvedValue("mock-principal-id");
        await handler(event, undefined, callback);
      });

      it("should have fetched authentication id correctly", async () => {
        expect(mockGetAuthId).toHaveBeenCalledWith("mock-auth-token");
      });

      it("should create auth policy correctly", () => {
        expect(mockGenerateAuthPolicy).toHaveBeenCalledWith(
          "mock-principal-id",
          "Allow",
          "mock-method-arn"
        );
      });

      it("should invoke callback with correct arguments", () => {
        expect(callback).toHaveBeenCalledWith(
          null,
          "mock-generate-auth-policy"
        );
      });
    });
  });
});
