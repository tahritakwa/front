import { DocumentAccountLine } from './document-account-line';


export class BankReconciliation {
   id: number;
   closeMonth: number;
   fiscalYearId: number;
   fiscalYearLabel: string;
   accountId: number;
   accountLabel: string;
   accountCode: number;
   initialAmount: number;
   finalAmount: number;
   closeDocumentAccountLines: DocumentAccountLine[];
   documentAccountLinesAffected: DocumentAccountLine[];
   documentAccountLinesReleased: DocumentAccountLine[];

   constructor() {
  }
  }
