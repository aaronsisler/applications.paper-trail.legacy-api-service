import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";
import { User } from "../../models/user";
let mockGetUser: jest.Mock;

jest.mock("../../services/user-service", () => {
  return {
    UserService: jest.fn(() => ({
      getUser: mockGetUser
    }))
  };
});

jest.mock("../../utils/response-body-builder", () => {
  return { responseBodyBuilder: jest.fn(() => "body-built-response") };
});

describe("user get handler", () => {
  let callback: Function;
  let event: object;

  beforeEach(async () => {
    callback = jest.fn();
    event = { pathParameters: { userId: "mock-id" } };
  });

  describe("when the call is successful", () => {
    beforeEach(() => {
      mockGetUser = jest
        .fn()
        .mockResolvedValue(new User({ userId: "mock-id" }));
      handler(event, undefined, callback);
    });

    it("should call user service with correct arguments", () => {
      expect(mockGetUser).toHaveBeenCalledWith("mock-id");
    });

    it("should call response body builder with correct arguments", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith({
        statusCode: 200,
        body: { userId: "mock-id" }
      });
    });

    it("should invoke callback with correct arguments", () => {
      expect(callback).toHaveBeenCalledWith(null, "body-built-response");
    });
  });

  describe("when the call is NOT successful", () => {
    beforeEach(async () => {
      mockGetUser = jest.fn().mockRejectedValue({});
      await handler(event, undefined, callback);
    });

    it("should call response body builder with correct arguments", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith({
        statusCode: 500,
        body: "Something went wrong"
      });
    });

    it("should invoke callback with correct arguments", () => {
      expect(callback).toHaveBeenCalledWith("body-built-response");
    });
  });
});
