export class DocumentAccountLine {
  id: number;
  documentLineDate: Date;
  reference: string;
  label: string;
  debitAmount: number;
  creditAmount: number;
  accountId: string;
  nameAccount: string;
  codeAccount: string;
  close: boolean;
  letter: string;
  reconciliationDate: Date;

  constructor(id?: number, documentLineDate?: Date, reference?: string, label?: string, debitAmount?: number, creditAmount?: number, accountId?: string, nameAccount?: string,
    codeAccount?: string, close?: boolean, letter?: string, reconciliationDate?: Date) {
    this.id = id;
    this.documentLineDate = documentLineDate;
    this.reference = reference;
    this.label = label;
    this.debitAmount = debitAmount;
    this.creditAmount = creditAmount;
    this.accountId = accountId;
    this.nameAccount = nameAccount;
    this.codeAccount = codeAccount;
    this.close = close;
    this.letter = letter;
    this.reconciliationDate = reconciliationDate;
  }
}
