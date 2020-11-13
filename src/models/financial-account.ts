export class FinancialAccount {
  accountId: string;

  financialInstituitionName: string;

  constructor(accountId: string, financialInstituitionName: string) {
    this.accountId = accountId;
    this.financialInstituitionName = financialInstituitionName;
  }
}
