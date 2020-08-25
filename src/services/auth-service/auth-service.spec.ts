import axios from "axios";
import { AuthService } from "./index";

jest.mock("../../config", () => ({
  TOKEN_HEADER: "mock-token-header",
  TOKEN_VALIDATION_URL: "mock-token-validation-url"
}));

jest.mock("axios", () => ({ get: jest.fn() }));

describe("services/AuthService", () => {
  let authService: AuthService;
  let consoleLog: any;
  let returnedAuthId: string;
  const mockRequest = { headers: { "mock-token-header": "Bearer mock-token" } };

  beforeEach(() => {
    consoleLog = console.log;
    authService = new AuthService();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it("should be a class", () => {
    expect(typeof AuthService).toEqual("function");
    expect(typeof authService).toEqual("object");
  });

  describe("when getAuthId is invoked", () => {
    describe("and headers do NOT contain correct token header", () => {
      beforeEach(async () => {
        authService = new AuthService();
        returnedAuthId = await authService.getAuthId({});
      });

      it("should return the correct user", () => {
        expect(returnedAuthId).toEqual(undefined);
      });

      it("should log correct messages to the console", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: AuthService");
        expect(console.log).toHaveBeenCalledWith("No token found in headers");
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
          expect(console.log).toHaveBeenCalledWith("ERROR: AuthService");
          expect(console.log).toHaveBeenCalledWith("No token found in headers");
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
          expect(console.log).toHaveBeenCalledWith("ERROR: AuthService");
          expect(console.log).toHaveBeenCalledWith("Token cannot be empty");
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
            expect(console.log).toHaveBeenCalledWith("ERROR: AuthService");
            expect(console.log).toHaveBeenCalledWith("OAuth token not valid");
          });
        });
      });
    });
  });
});
