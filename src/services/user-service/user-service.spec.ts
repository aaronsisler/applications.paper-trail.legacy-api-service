import { UserService } from "./index";
import { rawUserDetails } from "../../mocks/raw-user-details";
import { user } from "../../mocks/user";

let mockGetItem: jest.Mock;

jest.mock("../../services/database-service", () => {
  return {
    DatabaseService: jest.fn().mockImplementation(() => ({
      getItem: mockGetItem
    }))
  };
});

describe("services/UserService", () => {
  let userService: UserService;
  let consoleLog: any;
  let returnedUser: any;

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
    it("should create a new database service instance", () => {
      expect(userService["databaseService"]).toBeDefined();
    });
  });

  describe("when a GET user is invoked", () => {
    describe("and is successful", () => {
      beforeEach(async () => {
        mockGetItem = jest.fn().mockResolvedValue(rawUserDetails);
        userService = new UserService();
        returnedUser = await userService.getUser("mock-user-id");
      });

      it("should call the database service with correct parameters", () => {
        expect(userService["databaseService"].getItem).toHaveBeenCalledWith(
          "userId",
          "mock-user-id",
          "userDetails"
        );
      });

      it("should return the correct user", () => {
        expect(returnedUser).toEqual(user);
      });
    });

    describe("and is NOT successful", () => {
      const expectedError = "mock-error";

      beforeEach(async () => {
        mockGetItem = jest.fn().mockRejectedValue(expectedError);
        userService = new UserService();
        returnedUser = await userService.getUser("mock-user-id");
      });

      it("should call the database service with correct parameters", () => {
        expect(userService["databaseService"].getItem).toHaveBeenCalledWith(
          "userId",
          "mock-user-id",
          "userDetails"
        );
      });

      it("should return the correct user", () => {
        expect(returnedUser).toEqual(undefined);
      });

      it("should log correct messages to the console", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: UserService");
        expect(console.log).toHaveBeenCalledWith(expectedError);
      });
    });
  });
});
