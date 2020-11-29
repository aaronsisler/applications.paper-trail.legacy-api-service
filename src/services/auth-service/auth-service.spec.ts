import axios from "axios";
import { AuthService } from "./index";
import { errorLogger } from "../../utils/error-logger";
import * as stringUtils from "../../utils/string-utils";

jest.mock("axios", () => ({ get: jest.fn() }));

jest.mock("../../config", () => ({
  TOKEN_HEADER: "mock-token-header",
  TOKEN_VALIDATION_URL: "mock-token-validation-url"
}));

jest.mock("../../utils/error-logger");

describe("services/AuthService", () => {
  let authService: AuthService;
  let returnedAuthId: string;
  let mockIsStringEmpty: jest.SpyInstance;

  beforeEach(() => {
    authService = new AuthService();
    mockIsStringEmpty = jest.spyOn(stringUtils, "isStringEmpty");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof AuthService).toEqual("function");
    expect(typeof authService).toEqual("object");
  });

  describe("when an authentication id is requested", () => {
    describe("and the auth header is valid", () => {
      const authToken = "mock-token-bearer mock-token";

      describe("and the validation request is successful", () => {
        beforeEach(async () => {
          axios.get = jest
            .fn()
            .mockResolvedValue({ data: { sub: "mock-sub" } });
          returnedAuthId = await authService.getAuthId(authToken);
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
            await authService.getAuthId(authToken);
          } catch (error) {} // eslint-disable-line no-empty
        });

        it("should call the validation endpoint with correct parameter", () => {
          expect(axios.get).toHaveBeenCalledWith("mock-token-validation-url", {
            params: { id_token: "mock-token" }
          });
        });

        it("should throw an error", async () => {
          await expect(authService.getAuthId(authToken)).rejects.toThrowError(
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

    describe("and the auth header is NOT valid", () => {
      describe("and auth header is NOT formatted correctly", () => {
        const authToken = "";

        beforeEach(() => {
          mockIsStringEmpty.mockImplementation(() => {
            throw new Error("mock-string-empty-error");
          });
        });

        it("should throw an error", async () => {
          await expect(authService.getAuthId(authToken)).rejects.toThrowError(
            "mock-string-empty-error"
          );
        });
      });

      describe("and auth header is formatted correctly", () => {
        describe("and auth token is empty", () => {
          const authToken = "trailing_space_intentional ";

          it("should throw an error", async () => {
            await expect(authService.getAuthId(authToken)).rejects.toThrowError(
              "Token cannot be empty"
            );
          });

          it("should log error messages correctly", async () => {
            try {
              await authService.getAuthId(authToken);
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
});
