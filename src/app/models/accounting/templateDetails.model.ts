export class TemplateDetails {
  id: number;
  label: string;
  accountId: number;
  nameAccount: string;
  documentLineDate: Date;
  debitAmount: number;
  creditAmount: number;
  templateAccountingId: number;

  constructor(dataItem?: TemplateDetails) {
    if (dataItem) {
      Object.assign(this, dataItem);
    }
  }
}
