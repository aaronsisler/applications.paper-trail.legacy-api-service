import { DatabaseService } from "./index";
import { KeyValuePair } from "../../models/key-value-pair";
import { errorLogger } from "../../utils/error-logger";

let mockDDBItem: jest.Mock;
let mockPut: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE: "mock-ddb-table" }));

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn()
  },
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: mockPut
    }))
  }
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("Services/DatabaseService:Create", () => {
  const mockTable = "MOCK_DATABASE_TABLE";
  const mockFirstKey = new KeyValuePair(
    "mock-first-key",
    "mock-first-key-value"
  );
  const mockSecondKey = new KeyValuePair(
    "mock-second-key",
    "mock-second-key-value"
  );
  const mockItem = {
    "mock-first-key": "mock-first-key-value",
    "mock-attribute": "mock-attribute-value"
  };

  let databaseService: DatabaseService;

  beforeEach(() => {
    mockDDBItem = jest.fn().mockResolvedValue({ Items: "mock-items" });
    mockPut = jest.fn(() => ({ promise: mockDDBItem }));
    databaseService = new DatabaseService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("when a record is created", () => {
    describe("and no keys are given", () => {
      beforeEach(async () => {
        databaseService = new DatabaseService();

        try {
          await databaseService.create(mockTable, undefined, mockItem);
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should throw an error", async () => {
        expect.assertions(1);

        try {
          await databaseService.create(mockTable, undefined, mockItem);
        } catch (error) {
          expect(error.message).toEqual("Record not created");
        }
      });

      it("should log error messages correctly", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "DatabaseService",
          "Incorrect keys provided"
        );
      });
    });

    describe("and one key is given", () => {
      const expectedParams = {
        TableName: "MOCK_DATABASE_TABLE",
        Key: { "mock-first-key": "mock-first-key-value" },
        Item: mockItem,
        ConditionExpression: "attribute_not_exists(#hashKey)",
        ExpressionAttributeNames: { "#hashKey": "mock-first-key" }
      };

      describe("and the call is successful", () => {
        beforeEach(async () => {
          await databaseService.create(mockTable, [mockFirstKey], mockItem);
        });

        it("should have called the database with correct params", async () => {
          expect(mockPut).toHaveBeenCalledWith(expectedParams);
        });
      });

      describe("and the call is NOT successful", () => {
        beforeEach(async () => {
          mockDDBItem = jest.fn().mockRejectedValue("mock-error");
          databaseService = new DatabaseService();

          try {
            await databaseService.create(mockTable, [mockFirstKey], mockItem);
          } catch (error) {} // eslint-disable-line no-empty
        });

        it("should have called the database with correct params", async () => {
          expect(mockPut).toHaveBeenCalledWith(expectedParams);
        });

        it("should throw an error", async () => {
          expect.assertions(1);

          try {
            await databaseService.create(mockTable, [mockFirstKey], mockItem);
          } catch (error) {
            expect(error.message).toEqual("Record not created");
          }
        });

        it("should log error messages correctly", () => {
          expect(errorLogger).toHaveBeenCalledWith(
            "DatabaseService",
            "mock-error"
          );
        });
      });
    });

    describe("and two keys are given", () => {
      const expectedParams = {
        TableName: "MOCK_DATABASE_TABLE",
        Key: { "mock-first-key": "mock-first-key-value" },
        Item: mockItem,
        ConditionExpression:
          "attribute_not_exists(#hashKey) AND attribute_not_exists(#rangeKey)",
        ExpressionAttributeNames: {
          "#hashKey": "mock-first-key",
          "#rangeKey": "mock-second-key"
        }
      };

      describe("and the call is successful", () => {
        beforeEach(async () => {
          await databaseService.create(
            mockTable,
            [mockFirstKey, mockSecondKey],
            mockItem
          );
        });

        it("should have called the database with correct params", async () => {
          expect(mockPut).toHaveBeenCalledWith(expectedParams);
        });
      });

      describe("and the call is NOT successful", () => {
        beforeEach(async () => {
          mockDDBItem = jest.fn().mockRejectedValue("mock-error");
          mockPut = jest.fn(() => ({ promise: mockDDBItem }));
          databaseService = new DatabaseService();

          try {
            await databaseService.create(
              mockTable,
              [mockFirstKey, mockSecondKey],
              mockItem
            );
          } catch (error) {} // eslint-disable-line no-empty
        });

        it("should have called the database with correct params", async () => {
          expect(mockPut).toHaveBeenCalledWith(expectedParams);
        });

        it("should throw an error", async () => {
          expect.assertions(1);

          try {
            await databaseService.create(
              mockTable,
              [mockFirstKey, mockSecondKey],
              mockItem
            );
          } catch (error) {
            expect(error.message).toEqual("Record not created");
          }
        });

        it("should log error messages correctly", () => {
          expect(errorLogger).toHaveBeenCalledWith(
            "DatabaseService",
            "mock-error"
          );
        });
      });
    });
  });
});
