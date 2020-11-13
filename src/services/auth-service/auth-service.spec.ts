import axios from "axios";
import { AuthService, AuthRequest } from "./index";
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
  const mockRequest: AuthRequest = {
    headers: { "mock-token-header": "Bearer mock-token" }
  };

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

  describe("when getAuthId is invoked", () => {
    describe("and headers do NOT contain correct token header", () => {
      beforeEach(async () => {
        authService = new AuthService();
        returnedAuthId = await authService.getAuthId({
          headers: { "mock-header": "empty" }
        });
      });

      it("should return the correct user", () => {
        expect(returnedAuthId).toEqual(undefined);
      });

      it("should log correct messages to the console", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "AuthService",
          "No token found in headers"
        );
      });
    });

    describe("and headers do contain correct token header", () => {
      describe("and token header is empty", () => {
        beforeEach(async () => {
          authService = new AuthService();
          returnedAuthId = await authService.getAuthId({
            headers: { "mock-token-header": undefined }
          });
        });

        it("should return the correct user", () => {
          expect(returnedAuthId).toEqual(undefined);
        });

        it("should log correct messages to the console", () => {
          expect(errorLogger).toHaveBeenCalledWith(
            "AuthService",
            "No token found in headers"
          );
        });
      });

      describe("and token header is NOT valid", () => {
        beforeEach(async () => {
          authService = new AuthService();
          returnedAuthId = await authService.getAuthId({
            headers: { "mock-token-header": "Bearer " }
          });
        });

        it("should return the correct user", () => {
          expect(returnedAuthId).toEqual(undefined);
        });

        it("should log correct messages to the console", () => {
          expect(errorLogger).toHaveBeenCalledWith(
            "AuthService",
            "Token cannot be empty"
          );
        });
      });

      describe("and token header is valid", () => {
        describe("and is successful", () => {
          beforeEach(async () => {
            axios.get = jest
              .fn()
              .mockResolvedValue({ data: { sub: "mock-sub" } });
            authService = new AuthService();
            returnedAuthId = await authService.getAuthId(mockRequest);
          });

          it("should call the validation endpoint with correct parameter", () => {
            expect(axios.get).toHaveBeenCalledWith(
              "mock-token-validation-url",
              {
                params: { id_token: "mock-token" }
              }
            );
          });

          it("should return the correct user", () => {
            expect(returnedAuthId).toEqual("mock-sub");
          });
        });

        describe("and is NOT successful", () => {
          const expectedError = "mock-error";

          beforeEach(async () => {
            axios.get = jest.fn().mockRejectedValue(expectedError);
            authService = new AuthService();
            returnedAuthId = await authService.getAuthId(mockRequest);
          });

          it("should call the validation endpoint with correct parameter", () => {
            expect(axios.get).toHaveBeenCalledWith(
              "mock-token-validation-url",
              {
                params: { id_token: "mock-token" }
              }
            );
          });

          it("should return the correct user", () => {
            expect(returnedAuthId).toEqual(undefined);
          });

          it("should log correct messages to the console", () => {
            expect(errorLogger).toHaveBeenCalledWith(
              "AuthService",
              "OAuth token not valid"
            );
          });
        });
      });
    });
  });
});
