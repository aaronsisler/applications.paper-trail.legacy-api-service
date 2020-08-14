import { TransactionService } from "./index";

jest.mock("../../services/database-service", () => {
  return {
    DatabaseService: jest.fn().mockImplementation(() => ({}))
  };
});

describe("services/TransactionService", () => {
  let transactionService: TransactionService;
  let consoleLog: any;

  beforeEach(() => {
    consoleLog = console.log;
    transactionService = new TransactionService();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it("should be a class", () => {
    expect(typeof TransactionService).toEqual("function");
    expect(typeof transactionService).toEqual("object");
  });

  describe("when instantiated", () => {
    it("should create a new database service instance", () => {
      expect(transactionService["databaseService"]).toBeDefined();
    });
  });

  describe("when a transaction is created", () => {
    describe("and is successful", () => {});

    describe("and is NOT successful", () => {});
  });
});
