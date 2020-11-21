import aws from "aws-sdk";
import { ItemList } from "aws-sdk/clients/dynamodb";
import { DatabaseService } from "./index";
import { KeyValuePair } from "../../models/key-value-pair";
import { errorLogger } from "../../utils/error-logger";

let mockDDBItem: jest.Mock;
let mockQuery: jest.Mock;
let mockPut: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE: "mock-ddb-table" }));

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn()
  },
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      query: mockQuery,
      put: mockPut
    }))
  }
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("Services/DatabaseService", () => {
  const mockTable = "MOCK_DATABASE_TABLE";
  const mockKey = new KeyValuePair("mock-key", "mock-key-value");
  const mockItem = {
    "mock-key": "mock-key-value",
    "mock-attribute": "mock-attribute-value"
  };

  let databaseService: DatabaseService;

  beforeEach(() => {
    mockDDBItem = jest.fn().mockResolvedValue({ Items: "mock-items" });
    mockQuery = jest.fn(() => ({ promise: mockDDBItem }));
    mockPut = jest.fn(() => ({ promise: mockDDBItem }));
    databaseService = new DatabaseService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof DatabaseService).toEqual("function");
    expect(typeof databaseService).toEqual("object");
  });

  describe("when instantiated", () => {
    it("should update the configuration correctly", () => {
      expect(aws.config.update).toHaveBeenCalledWith({ region: "us-east-1" });
    });

    it("should create a new instance of the correct type", () => {
      expect(aws.DynamoDB.DocumentClient).toHaveBeenCalled();
    });
  });

  describe("when a record is created", () => {
    const expectedParams = {
      TableName: "MOCK_DATABASE_TABLE",
      Key: { "mock-key": "mock-key-value" },
      Item: mockItem
    };

    describe("and the call is successful", () => {
      beforeEach(async () => {
        await databaseService.create(mockTable, mockKey, mockItem);
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
          await databaseService.create(mockTable, mockKey, mockItem);
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should have called the database with correct params", async () => {
        expect(mockPut).toHaveBeenCalledWith(expectedParams);
      });

      it("should throw an error", async () => {
        expect.assertions(1);

        try {
          await databaseService.create(mockTable, mockKey, mockItem);
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

  describe("when a record is requested", () => {
    const expectedParams = {
      TableName: "MOCK_DATABASE_TABLE",
      KeyConditionExpression: "#keyName = :keyValue",
      ExpressionAttributeNames: {
        "#keyName": "mock-key"
      },
      ExpressionAttributeValues: {
        ":keyValue": "mock-key-value"
      }
    };
    let returnedItem: ItemList;

    describe("and the call is successful", () => {
      beforeEach(async () => {
        returnedItem = await databaseService.read(mockTable, mockKey);
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
          await databaseService.read(mockTable, mockKey);
        } catch (error) {} // eslint-disable-line no-empty
      });

      it("should have called the database with correct params", async () => {
        expect(mockQuery).toHaveBeenCalledWith(expectedParams);
      });

      it("should throw an error", async () => {
        await expect(
          databaseService.read(mockTable, mockKey)
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
