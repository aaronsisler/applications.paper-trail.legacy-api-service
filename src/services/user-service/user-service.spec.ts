import { UserService } from "./index";

jest.mock("../database-service");

describe("UserService", () => {
  let userService: UserService;
  let consoleLog: any;

  beforeEach(() => {
    consoleLog = console.log;
    userService = new UserService();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it("should be a class", () => {
    expect(typeof UserService).toEqual("function");
    expect(typeof userService).toEqual("object");
  });
});
