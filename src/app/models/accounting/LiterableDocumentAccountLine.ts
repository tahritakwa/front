export class LiterableDocumentAccountLine {
  id: number;
  account: string;
  letter: string;
  credit: number;
  debit: number;
  balance: number;
  documentAccount: number;
  documentAccountCode: string;
  documentAccountDate: string;
  journal: string;
  reference: string;

  constructor(id?: number, account?: string, letter?: string, credit?: number, debit?: number, documentAccount?: number) {
    this.id = id;
    this.account = account;
    this.letter = letter;
    this.credit = credit;
    this.debit = debit;
    this.documentAccount = documentAccount;
  }

}
