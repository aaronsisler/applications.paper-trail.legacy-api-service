import { UserService } from "./index";
import { rawUserDetails } from "../../mocks/raw-user-details";
import { userDetails } from "../../mocks/user-details";
import { User } from "../../models/user";
import { errorLogger } from "../../utils/error-logger";

let mockRead: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE_USERS: "mock-users-table" }));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

jest.mock("../../services/database-service", () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    read: mockRead
  }))
}));

describe("services/UserService", () => {
  const mockKey = { userId: "mock-user-id" };
  let userService: UserService;
  let returnedUser: User;

  beforeEach(() => {
    userService = new UserService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof UserService).toEqual("function");
    expect(typeof userService).toEqual("object");
  });

  describe("when user details are requested", () => {
    describe("and is successful", () => {
      beforeEach(async () => {
        mockRead = jest.fn().mockResolvedValue(rawUserDetails);
        userService = new UserService();
        returnedUser = await userService.getUserDetails("mock-user-id");
      });

      it("should call the database service with correct parameters", () => {
        expect(mockRead).toHaveBeenCalledWith("mock-users-table", mockKey);
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
        expect(mockRead).toHaveBeenCalledWith("mock-users-table", mockKey);
      });

      it("should return the correct user", () => {
        expect(returnedUser).toEqual(undefined);
      });

      it("should log correct messages to the console", () => {
        expect(errorLogger).toHaveBeenCalledWith("UserService", expectedError);
      });
    });
  });
});
