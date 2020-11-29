import { APIGatewayProxyResult, Callback } from "aws-lambda";
import { handler } from "./index";
import { Health } from "../../models/health";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const mockHealth: Health = {
  message: "mock-message",
  currentTime: "mock-current-time"
};
const mockResponse = { statusCode: 200, body: mockHealth };

let mockGetHealth: jest.Mock;

jest.mock("../../services/health-service", () => ({
  HealthService: jest.fn().mockImplementation(() => ({
    getHealth: mockGetHealth
  }))
}));

jest.mock("../../utils/response-body-builder", () => ({
  responseBodyBuilder: jest.fn().mockReturnValue("mock-built-response")
}));

describe("handlers/health", () => {
  it("should be the correct type", () => {
    expect(typeof handler).toEqual("function");
  });

  describe("when handler is invoked", () => {
    let callback: Callback<APIGatewayProxyResult>;

    beforeEach(() => {
      mockGetHealth = jest.fn().mockReturnValue(mockHealth);
      callback = jest.fn();
      handler(undefined, undefined, callback);
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("should create the response correctly", () => {
      expect(responseBodyBuilder).toHaveBeenCalledWith(mockResponse);
    });

    it("should invoke callback with correct arguments", () => {
      expect(callback).toHaveBeenCalledWith(null, "mock-built-response");
    });
  });
});
