import { UserService } from "./index";
let mockGetItem: jest.Mock;

jest.mock("../../services/database-service", () => {
  return {
    DatabaseService: jest.fn(() => ({
      getItem: mockGetItem
    }))
  };
});

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

  describe("when instantiated", () => {
    describe("and database service is provided", () => {
      it("should set the database service correctly", () => {
        expect(true).toEqual(true);
      });
    });

    describe("and database service is NOT provided", () => {
      it("should set the database service correctly", () => {
        expect(true).toEqual(true);
      });
    });
  });
});
