import { ItemList } from "aws-sdk/clients/dynamodb";
import { DatabaseService } from "./index";
import { KeyValuePair } from "../../models/key-value-pair";
import { errorLogger } from "../../utils/error-logger";

let mockDDBItem: jest.Mock;
let mockQuery: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE: "mock-ddb-table" }));

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn()
  },
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      query: mockQuery
    }))
  }
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("Services/DatabaseService", () => {
  const mockTable = "MOCK_DATABASE_TABLE";
  const mockFirstKey = new KeyValuePair(
    "mock-first-key",
    "mock-first-key-value"
  );

  let databaseService: DatabaseService;

  beforeEach(() => {
    mockDDBItem = jest.fn().mockResolvedValue({ Items: "mock-items" });
    mockQuery = jest.fn(() => ({ promise: mockDDBItem }));
    databaseService = new DatabaseService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("when a record is requested", () => {
    const expectedParams = {
      TableName: "MOCK_DATABASE_TABLE",
      KeyConditionExpression: "#keyName = :keyValue",
      ExpressionAttributeNames: {
        "#keyName": "mock-first-key"
      },
      ExpressionAttributeValues: {
        ":keyValue": "mock-first-key-value"
      }
    };
    let returnedItem: ItemList;

    describe("and the call is successful", () => {
      beforeEach(async () => {
        returnedItem = await databaseService.read(mockTable, mockFirstKey);
      });

      it("should have called the database with correct params", async () => {
        expect(mockQuery).toHaveBeenCalledWith(expectedParams);
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual("mock-items");
      });
    });

    describe("and the call is NOT successful", () => {
      beforeEach(async () => {
        mockDDBItem = jest.fn().mockRejectedValue("mock-error");

        try {
          await databaseService.read(mockTable, mockFirstKey);
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should have called the database with correct params", async () => {
        expect(mockQuery).toHaveBeenCalledWith(expectedParams);
      });

      it("should throw an error", async () => {
        await expect(
          databaseService.read(mockTable, mockFirstKey)
        ).rejects.toThrowError("Records not found");
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
