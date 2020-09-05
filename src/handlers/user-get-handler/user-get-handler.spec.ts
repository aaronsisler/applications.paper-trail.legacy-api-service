import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";

let mockGetAuthId: jest.Mock;
let mockGetUserDetails: jest.Mock;

jest.mock("../../services/auth-service", () => {
  return {
    AuthService: jest.fn(() => ({
      getAuthId: mockGetAuthId
    }))
  };
});

jest.mock("../../services/user-service", () => {
  return {
    UserService: jest.fn(() => ({
      getUserDetails: mockGetUserDetails
    }))
  };
});

jest.mock("../../utils/response-body-builder", () => {
  return { responseBodyBuilder: jest.fn(() => "mock-body-built-response") };
});

describe("handlers/user-get", () => {
  let callback: Function;
  let event: object;

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
      mockGetUserDetails = jest.fn();
    });

    it("should call user service with correct arguments", async () => {
      await handler(event, undefined, callback);

      expect(mockGetUserDetails).toHaveBeenCalledWith("mock-auth-id");
    });

    describe("when fetched user is found", () => {
      beforeEach(async () => {
        mockGetUserDetails = jest.fn().mockResolvedValue("mock-user");
        await handler(event, undefined, callback);
      });

      it("should call the response body builder with the correct parameters", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith({
          statusCode: 200,
          body: "mock-user"
        });
      });

      it("should invoke the callback with the correct response", () => {
        expect(callback).toHaveBeenCalledWith(null, "mock-body-built-response");
      });
    });

    describe("when fetched user is NOT found", () => {
      beforeEach(async () => {
        mockGetUserDetails = jest.fn().mockResolvedValue(undefined);
        await handler(event, undefined, callback);
      });

      it("should call the response body builder with the correct parameters", () => {
        expect(responseBodyBuilder).toHaveBeenCalledWith({
          statusCode: 204,
          body: undefined
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
