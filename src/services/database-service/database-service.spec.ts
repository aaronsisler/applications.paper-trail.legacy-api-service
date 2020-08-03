import { DatabaseService } from "./index";
import aws from "aws-sdk";

let mockDDBItem: jest.Mock;
let mockDDBGetItem: jest.Mock;

jest.mock("aws-sdk", () => {
  return {
    config: {
      update: jest.fn()
    },
    DynamoDB: jest.fn()
  };
});

describe("DatabaseService", () => {
  let dynamoDB: any;
  let databaseService: DatabaseService;
  let consoleLog: any;

  beforeEach(() => {
    mockDDBItem = jest.fn().mockResolvedValue({ Item: "mock-item" });
    mockDDBGetItem = jest.fn(() => ({ promise: mockDDBItem }));
    dynamoDB = jest.fn().mockImplementation(() => ({
      getItem: mockDDBGetItem
    }));
    databaseService = new DatabaseService(new dynamoDB());
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

    it("should set the api version correctly", () => {
      databaseService = new DatabaseService();
      expect(aws.DynamoDB).toHaveBeenCalledWith({ apiVersion: "2012-08-10" });
    });
  });

  describe("when getItem is invoked with a string", () => {
    let returnedItem: any;

    describe("and the call is successful", () => {
      beforeEach(async () => {
        returnedItem = await databaseService.getItem(
          "mock-string-key",
          "mock-string"
        );
      });

      it("should have called the database with correct params", async () => {
        expect(mockDDBGetItem).toHaveBeenCalledWith({
          Key: {
            "mock-string-key": {
              S: "mock-string"
            }
          },
          TableName: "PAPER_TRAIL_SERVICE_POC"
        });
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual("mock-item");
      });
    });

    describe("and the call is NOT successful", () => {
      beforeEach(async () => {
        mockDDBItem = jest.fn().mockRejectedValue({});

        returnedItem = await databaseService.getItem(
          "mock-string-key",
          "mock-string"
        );
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual(undefined);
      });

      it("should call the console log with correct message", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: DatabaseService");
      });
    });
  });

  describe("when getItem is invoked with a number", () => {
    let returnedItem: any;

    describe("and the call is successful", () => {
      beforeEach(async () => {
        returnedItem = await databaseService.getItem("mock-number-key", 123);
      });

      it("should have called the database with correct params", async () => {
        expect(mockDDBGetItem).toHaveBeenCalledWith({
          Key: {
            "mock-number-key": {
              N: 123
            }
          },
          TableName: "PAPER_TRAIL_SERVICE_POC"
        });
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual("mock-item");
      });
    });

    describe("and the call is NOT successful", () => {
      beforeEach(async () => {
        mockDDBItem = jest.fn().mockRejectedValue({});

        returnedItem = await databaseService.getItem("mock-number-key", 123);
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual(undefined);
      });

      it("should call the console log with correct message", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: DatabaseService");
      });
    });
  });

  describe("when getItem is invoked with a boolean", () => {
    let returnedItem: any;

    describe("and the call is successful", () => {
      beforeEach(async () => {
        returnedItem = await databaseService.getItem("mock-boolean-key", true);
      });

      it("should have called the database with correct params", async () => {
        expect(mockDDBGetItem).toHaveBeenCalledWith({
          Key: {
            "mock-boolean-key": {
              B: true
            }
          },
          TableName: "PAPER_TRAIL_SERVICE_POC"
        });
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual("mock-item");
      });
    });

    describe("and the call is NOT successful", () => {
      beforeEach(async () => {
        mockDDBItem = jest.fn().mockRejectedValue({});

        returnedItem = await databaseService.getItem("mock-boolean-key", true);
      });

      it("should return the correct item", () => {
        expect(returnedItem).toEqual(undefined);
      });

      it("should call the console log with correct message", () => {
        expect(console.log).toHaveBeenCalledWith("ERROR: DatabaseService");
      });
    });
  });
});
