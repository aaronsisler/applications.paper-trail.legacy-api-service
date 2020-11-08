import { DatabaseService } from "./index";
import aws from "aws-sdk";

let mockDDBItem: jest.Mock;
let mockGet: jest.Mock;

jest.mock("../../config", () => ({ DATABASE_TABLE: "mock-ddb-table" }));

jest.mock("aws-sdk", () => {
  return {
    config: {
      update: jest.fn()
    },
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => ({
        get: mockGet
      }))
    }
  };
});

describe("DatabaseService", () => {
  let databaseService: DatabaseService;
  let consoleLog: any;

  beforeEach(() => {
    mockDDBItem = jest.fn().mockResolvedValue({ Item: "mock-item" });
    mockGet = jest.fn(() => ({ promise: mockDDBItem }));
    databaseService = new DatabaseService();
    consoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = consoleLog;
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
    let returnedItem: any;

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

      it("should call the console log with correct message", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: DatabaseService");
        expect(console.log).toHaveBeenCalledWith("mock-error");
      });
    });
  });
});
