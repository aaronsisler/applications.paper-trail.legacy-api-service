import { TransactionMapper } from "./index";
import { rawTransaction } from "../../mocks/raw-transaction";
import { transaction } from "../../mocks/transaction";
import { DatabaseTypes } from "../../constants";

describe("mappers/TransactionMapper", () => {
  const transactionId = "mock-trans-id";
  beforeEach(() => {});

  it("should be a class", () => {
    expect(typeof TransactionMapper).toEqual("function");
  });

  describe("when mapping raw transaction data", () => {
    it("should return a transaction", () => {
      const resultTransaction = TransactionMapper.mapTransaction(
        rawTransaction[DatabaseTypes.OBJECT],
        transactionId
      );

      expect(resultTransaction).toEqual(transaction);
    });
  });
});
