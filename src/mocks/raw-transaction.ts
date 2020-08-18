const rawTransaction = {
  M: {
    amount: { N: 123.45 },
    financialAccountId: { S: "mock-financial-account-id" },
    isPending: { BOOL: false },
    merchantAltName: { S: "mock-merchant-alt-name" },
    merchantName: { S: "mock-merchant-name" },
    sourceTransId: { S: "mock-source-trans-id" },
    transCategoryIds: {
      L: [{ S: "mock-trans-cat-id-1" }, { S: "mock-trans-cat-id-2" }]
    },
    transDate: { S: "mock-trans-date" }
  }
};

export { rawTransaction };
