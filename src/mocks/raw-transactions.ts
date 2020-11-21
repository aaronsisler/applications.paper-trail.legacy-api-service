const rawTransactions = [
  {
    transactionId: "123",
    amount: 123.45,
    financialAccountId: "mock-financial-account-id-123",
    isPending: false,
    merchantAltName: "mock-merchant-alt-name-123",
    merchantName: "mock-merchant-name-123",
    sourceTransId: "mock-source-trans-id-123",
    transCategoryIds: ["mock-trans-cat-id-1", "mock-trans-cat-id-2"],
    transDate: "mock-trans-date-123"
  },
  {
    transactionId: "456",
    amount: 456.78,
    financialAccountId: "mock-financial-account-id-456",
    isPending: false,
    merchantAltName: "mock-merchant-alt-name-456",
    merchantName: "mock-merchant-name-456",
    sourceTransId: "mock-source-trans-id-456",
    transCategoryIds: ["mock-trans-cat-id-3", "mock-trans-cat-id-4"],
    transDate: "mock-trans-date-456"
  }
];

export { rawTransactions };
