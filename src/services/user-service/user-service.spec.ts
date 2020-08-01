import { DatabaseService } from "./index";
import aws from "aws-sdk";

let mockDDBItem = jest.fn().mockResolvedValue({ Item: "mock-item" });
jest.mock("aws-sdk", () => {
  return {
    config: {
      update: jest.fn()
    },
    DynamoDB: jest.fn(() => ({
      getItem: jest.fn(() => ({ promise: mockDDBItem }))
    }))
  };
});

describe("databaseService", () => {
  let databaseService: DatabaseService;
  const mockParams = { TableName: "mock-table", Key: { mockKey: { S: 123 } } };
  let consoleLog: any;

  beforeEach(() => {
    consoleLog = console.log;
    databaseService = new DatabaseService();
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
    it("should set the reqion correctly", () => {
      expect(aws.config.update).toHaveBeenCalledWith({ region: "us-east-1" });
    });

    it("should set the api version correctly", () => {
      expect(aws.DynamoDB).toHaveBeenCalledWith({ apiVersion: "2012-08-10" });
    });
  });

  describe("getItem()", () => {
    describe("when it is invoked", () => {
      let returnedItem: any;

      describe("and the call is successful", () => {
        beforeEach(async () => {
          returnedItem = await databaseService.getItem(mockParams);
        });

        it("should return the correct item", () => {
          expect(returnedItem).toEqual("mock-item");
        });
      });

      describe("and the call is NOT successful", () => {
        beforeEach(async () => {
          mockDDBItem = jest.fn().mockRejectedValue({});

          returnedItem = await databaseService.getItem(mockParams);
        });

        it("should return the correct item", () => {
          expect(returnedItem).toEqual(undefined);
        });
      });
    });
  });
});
