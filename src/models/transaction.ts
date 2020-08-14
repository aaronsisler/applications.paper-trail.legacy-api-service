import { FinancialAccount } from "./financial-acount";
import { TransactionCategory } from "./transaction-category";

export class Transaction {
  transId: string; // DDB unique generated ID
  sourceTransId: string; // transaction_id string Transaction Id from 3rd party API
  amount: number; // amount number
  financialAccount: FinancialAccount; // account_id string
  transCategories: TransactionCategory[]; // category string[]
  transDate: string; // date string
  merchantName: string; // merchant_name string
  merchantAltName: string; // name string
  isPending: boolean; // pending boolean

  constructor(options: {
    transId: string;
    sourceTransId: string;
    amount: number;
    financialAccount: FinancialAccount;
    transCategories: TransactionCategory[];
    transDate: string;
    merchantName: string;
    merchantAltName: string;
    isPending: boolean;
  }) {
    this.transId = options.transId;
    this.sourceTransId = options.sourceTransId;
    this.amount = options.amount;
    this.financialAccount = options.financialAccount;
    this.transCategories = options.transCategories;
    this.transDate = options.transDate;
    this.merchantName = options.merchantName;
    this.merchantAltName = options.merchantAltName;
    this.isPending = options.isPending;
  }
}
