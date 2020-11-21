export class Transaction {
  transactionId: string; // DDB unique generated ID

  sourceTransId: string; // transaction_id string Transaction Id from 3rd party API

  amount: number; // amount number

  financialAccountId: string; // account_id string

  transCategoryIds: string[]; // category string[]

  transDate: string; // date string

  merchantName: string; // merchant_name string

  merchantAltName: string; // name string

  isPending: boolean; // pending boolean

  constructor(options?: {
    transactionId: string;
    sourceTransId: string;
    amount: number;
    financialAccountId: string;
    transCategoryIds: string[];
    transDate: string;
    merchantName: string;
    merchantAltName: string;
    isPending: boolean;
  }) {
    if (options) {
      this.transactionId = options.transactionId;
      this.sourceTransId = options.sourceTransId;
      this.amount = options.amount;
      this.financialAccountId = options.financialAccountId;
      this.transCategoryIds = options.transCategoryIds;
      this.transDate = options.transDate;
      this.merchantName = options.merchantName;
      this.merchantAltName = options.merchantAltName;
      this.isPending = options.isPending;
    }
  }
}
