import aws from "aws-sdk";
import { DatabaseService } from "./index";
import { errorLogger } from "../../utils/error-logger";
import { DatabaseItem } from "../../models/database-item";

let mockDDBItem: jest.Mock;
let mockGet: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE: "mock-ddb-table" }));

jest.mock("aws-sdk", () => ({
  config: {
    update: jest.fn()
  },
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      get: mockGet
    }))
  }
}));

jest.mock("../../utils/error-logger", () => ({
  errorLogger: jest.fn().mockReturnThis()
}));

describe("DatabaseService", () => {
  let databaseService: DatabaseService;

  beforeEach(() => {
    mockDDBItem = jest.fn().mockResolvedValue({ Item: "mock-item" });
    mockGet = jest.fn(() => ({ promise: mockDDBItem }));
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

  describe("when a record is requested", () => {
    let returnedItem: DatabaseItem;

    describe("and the call is successful", () => {
      beforeEach(async () => {
        returnedItem = await databaseService.read(
          "mock-string-key",
          "mock-string",
          "userDetails"
        );
      });

      it("should have called the database with correct params", async () => {
        expect(mockGet).toHaveBeenCalledWith({
          Key: { "mock-string-key": "mock-string" },
          TableName: "mock-ddb-table",
          ProjectionExpression: "userDetails"
        });
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual("mock-item");
      });
    });

    describe("and the call is NOT successful", () => {
      beforeEach(async () => {
        mockDDBItem = jest.fn().mockRejectedValue("mock-error");

        returnedItem = await databaseService.read(
          "mock-string-key",
          "mock-string",
          "userDetails"
        );
      });

      it("should have called the database with correct params", async () => {
        expect(mockGet).toHaveBeenCalledWith({
          Key: { "mock-string-key": "mock-string" },
          TableName: "mock-ddb-table",
          ProjectionExpression: "userDetails"
        });
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual(undefined);
      });
      it("should log correct messages to the console", () => {
        expect(errorLogger).toHaveBeenCalledWith(
          "DatabaseService",
          "mock-error"
        );
      });
    });
  });
});
