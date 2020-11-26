import { UserService } from "./index";
import { rawUserDetails } from "../../mocks/raw-user-details";
import { userDetails } from "../../mocks/user-details";
import { KeyValuePair } from "../../models/key-value-pair";
import { User } from "../../models/user";
import { errorLogger } from "../../utils/error-logger";

let mockCreate: jest.Mock;
let mockRead: jest.Mock;
let mockUpdate: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE_USERS: "mock-users-table" }));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

jest.mock("../../services/database-service", () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    read: mockRead,
    update: mockUpdate
  }))
}));

describe("services/UserService", () => {
  const mockUserIdKeyValuePair = new KeyValuePair("userId", "mock-user-id");
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

  describe("when a user is created", () => {
    describe("and the call is successful", () => {
      beforeEach(async () => {
        mockCreate = jest.fn().mockResolvedValue(undefined);
        userService = new UserService();
        await userService.createUser(userDetails);
      });

      it("should publish to the database using the correct parameters", () => {
        expect(mockCreate).toHaveBeenCalledWith(
          "mock-users-table",
          [mockUserIdKeyValuePair],
          userDetails
        );
      });
    });

    describe("and the call is NOT successful", () => {
      const expectedError = "mock-error";

      beforeEach(async () => {
        mockCreate = jest.fn().mockRejectedValue(expectedError);
        try {
          userService = new UserService();
          await userService.createUser(userDetails);
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should publish to the database using the correct parameters", () => {
        expect(mockCreate).toHaveBeenCalledWith(
          "mock-users-table",
          [mockUserIdKeyValuePair],
          userDetails
        );
      });

      it("should throw an error", async () => {
        await expect(userService.createUser(userDetails)).rejects.toThrowError(
          "User not created"
        );
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith("UserService", expectedError);
      });
    });
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
            mockUserIdKeyValuePair
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
            mockUserIdKeyValuePair
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
          mockUserIdKeyValuePair
        );
      });

      it("should throw an error", async () => {
        await expect(userService.getUser("mock-user-id")).rejects.toThrowError(
          "User not found"
        );
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith("UserService", expectedError);
      });
    });
  });

  describe("when a user is updated", () => {
    describe("and the call is successful", () => {
      beforeEach(async () => {
        mockUpdate = jest.fn().mockResolvedValue(undefined);
        userService = new UserService();
        await userService.updateUser(userDetails);
      });

      it("should publish to the database using the correct parameters", () => {
        expect(mockUpdate).toHaveBeenCalledWith(
          "mock-users-table",
          [mockUserIdKeyValuePair],
          userDetails
        );
      });
    });

    describe("and the call is NOT successful", () => {
      const expectedError = "mock-error";

      beforeEach(async () => {
        mockUpdate = jest.fn().mockRejectedValue(expectedError);
        try {
          userService = new UserService();
          await userService.updateUser(userDetails);
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should publish to the database using the correct parameters", () => {
        expect(mockUpdate).toHaveBeenCalledWith(
          "mock-users-table",
          [mockUserIdKeyValuePair],
          userDetails
        );
      });

      it("should throw an error", async () => {
        await expect(userService.updateUser(userDetails)).rejects.toThrowError(
          "User not updated"
        );
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith("UserService", expectedError);
      });
    });
  });
});
