import { UserService } from "./index";
import { rawUserDetails } from "../../mocks/raw-user-details";
import { userDetails } from "../../mocks/user-details";
import { KeyValuePair } from "../../models/key-value-pair";
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
  const mockKeyValuePair = new KeyValuePair("userId", "mock-user-id");
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
      describe("and a user is NOT found", () => {
        beforeEach(async () => {
          mockRead = jest.fn().mockResolvedValue([]);
          userService = new UserService();
          try {
            userService = new UserService();
            await userService.getUser("mock-user-id");
          } catch (error) {} // eslint-disable-line no-empty
        });

        it("should call the database service with correct parameters", () => {
          expect(mockRead).toHaveBeenCalledWith(
            "mock-users-table",
            mockKeyValuePair
          );
        });

        it("should throw an error", async () => {
          await expect(
            userService.getUser("mock-user-id")
          ).rejects.toThrowError("User not found");
        });
      });
      describe("and a user is found", () => {
        beforeEach(async () => {
          mockRead = jest.fn().mockResolvedValue([rawUserDetails]);
          userService = new UserService();
          returnedUser = await userService.getUser("mock-user-id");
        });

        it("should call the database service with correct parameters", () => {
          expect(mockRead).toHaveBeenCalledWith(
            "mock-users-table",
            mockKeyValuePair
          );
        });

        it("should return the correct user", () => {
          expect(returnedUser).toEqual(userDetails);
        });
      });
    });

    describe("and is NOT successful", () => {
      const expectedError = "mock-error";

      beforeEach(async () => {
        mockRead = jest.fn().mockRejectedValue(expectedError);
        try {
          userService = new UserService();
          await userService.getUser("mock-user-id");
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should call the database service with correct parameters", () => {
        expect(mockRead).toHaveBeenCalledWith(
          "mock-users-table",
          mockKeyValuePair
        );
      });

      it("should throw an error", async () => {
        await expect(userService.getUser("mock-user-id")).rejects.toThrowError(
          "User not found"
        );
      });

      it("should log correct messages to the console", () => {
        expect(errorLogger).toHaveBeenCalledWith("UserService", expectedError);
      });
    });
  });
});
