export class Transaction {
  transactionId: string; // DDB unique generated ID

  amount: number; // amount number

  sourceTransId: string; // transaction_id string Transaction Id from 3rd party API

  financialAccountId: string; // account_id string

  transCategoryIds: string[]; // category string[]

  transDate: string; // date string

  merchantName: string; // merchant_name string

  merchantAltName: string; // name string

  isPending: boolean; // pending boolean

  constructor(options?: {
    transactionId: string;
    amount: number;
    sourceTransId: string;
    financialAccountId: string;
    transCategoryIds: string[];
    transDate: string;
    merchantName: string;
    merchantAltName: string;
    isPending: boolean;
  }) {
    if (options) {
      this.transactionId = options.transactionId;
      this.amount = options.amount;
      this.sourceTransId = options.sourceTransId;
      this.financialAccountId = options.financialAccountId;
      this.transCategoryIds = options.transCategoryIds;
      this.transDate = options.transDate;
      this.merchantName = options.merchantName;
      this.merchantAltName = options.merchantAltName;
      this.isPending = options.isPending;
    }
  }
}
