import axios from "axios";
import { HandlerRequest } from "../../models/handler-request";
import { AuthService } from "./index";
import { errorLogger } from "../../utils/error-logger";

jest.mock("../../config", () => ({
  TOKEN_HEADER: "mock-token-header",
  TOKEN_VALIDATION_URL: "mock-token-validation-url"
}));

jest.mock("axios", () => ({ get: jest.fn() }));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("services/AuthService", () => {
  let authService: AuthService;
  let returnedAuthId: string;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof AuthService).toEqual("function");
    expect(typeof authService).toEqual("object");
  });

  describe("when an authentication id is requested", () => {
    describe("and the request is valid", () => {
      const mockRequest: HandlerRequest = {
        headers: { Authorization: "mock-token-header mock-token" }
      };

      describe("and the validation request is successful", () => {
        beforeEach(async () => {
          axios.get = jest
            .fn()
            .mockResolvedValue({ data: { sub: "mock-sub" } });
          returnedAuthId = await authService.getAuthId(mockRequest);
        });

        it("should call the validation endpoint with correct parameter", () => {
          expect(axios.get).toHaveBeenCalledWith("mock-token-validation-url", {
            params: { id_token: "mock-token" }
          });
        });

        it("should return correctly", () => {
          expect(returnedAuthId).toEqual("mock-sub");
        });
      });

      describe("and the validation request is NOT successful", () => {
        const expectedError = "mock-error";

        beforeEach(async () => {
          axios.get = jest.fn().mockRejectedValue(expectedError);
          try {
            await authService.getAuthId(mockRequest);
          } catch (error) {} // eslint-disable-line no-empty
        });

        it("should call the validation endpoint with correct parameter", () => {
          expect(axios.get).toHaveBeenCalledWith("mock-token-validation-url", {
            params: { id_token: "mock-token" }
          });
        });

        it("should throw an error", async () => {
          await expect(authService.getAuthId(mockRequest)).rejects.toThrowError(
            "OAuth token not valid"
          );
        });

        it("should log error messages correctly", () => {
          expect(errorLogger).toHaveBeenCalledWith(
            "AuthService",
            "OAuth token not valid"
          );
        });
      });
    });

    describe("and the request is NOT valid", () => {
      describe("and headers does NOT contain correct header", () => {
        const mockRequest: HandlerRequest = { headers: {} };

        it("should throw an error", async () => {
          await expect(authService.getAuthId(mockRequest)).rejects.toThrowError(
            "No token found in headers"
          );
        });

        it("should log error messages correctly", async () => {
          try {
            await authService.getAuthId(mockRequest);
          } catch (error) {} // eslint-disable-line no-empty

          expect(errorLogger).toHaveBeenCalledWith(
            "AuthService",
            "No token found in headers"
          );
        });
      });

      describe("and authentication header is NOT valid", () => {
        const mockRequest: HandlerRequest = {
          headers: { Authorization: "mock-header-empty-token " } // Trailing space is correct here
        };

        it("should throw an error", async () => {
          await expect(authService.getAuthId(mockRequest)).rejects.toThrowError(
            "Token cannot be empty"
          );
        });

        it("should log error messages correctly", async () => {
          try {
            await authService.getAuthId(mockRequest);
          } catch (error) {} // eslint-disable-line no-empty

          expect(errorLogger).toHaveBeenCalledWith(
            "AuthService",
            "Token cannot be empty"
          );
        });
      });
    });
  });
});
