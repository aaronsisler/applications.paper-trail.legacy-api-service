import { AuthService } from "./index";

describe("AuthService", () => {
  let authService: AuthService;
  let consoleLog: any;

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
});
