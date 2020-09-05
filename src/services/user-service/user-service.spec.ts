import { UserService } from "./index";
import { rawUserDetails } from "../../mocks/raw-user-details";
import { userDetails } from "../../mocks/user-details";

let mockRead: jest.Mock;

jest.mock("../../services/database-service", () => {
  return {
    DatabaseService: jest.fn().mockImplementation(() => ({
      read: mockRead
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

  describe("when user details are requested", () => {
    describe("and is successful", () => {
      beforeEach(async () => {
        mockRead = jest.fn().mockResolvedValue(rawUserDetails);
        userService = new UserService();
        returnedUser = await userService.getUserDetails("mock-user-id");
      });

      it("should call the database service with correct parameters", () => {
        expect(userService["databaseService"].read).toHaveBeenCalledWith(
          "userId",
          "mock-user-id",
          "userDetails"
        );
      });

      it("should return the correct user", () => {
        expect(returnedUser).toEqual(userDetails);
      });
    });

    describe("and is NOT successful", () => {
      const expectedError = "mock-error";

      beforeEach(async () => {
        mockRead = jest.fn().mockRejectedValue(expectedError);
        userService = new UserService();
        returnedUser = await userService.getUserDetails("mock-user-id");
      });

      it("should call the database service with correct parameters", () => {
        expect(userService["databaseService"].read).toHaveBeenCalledWith(
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
