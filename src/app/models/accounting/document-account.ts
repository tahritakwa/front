import { DocumentAccountLine } from './document-account-line';

export class DocumentAccount {
  id: number;
  documentDate: Date;
  label: string;
  codeDocument: string;
  totalDebitAmount: number;
  totalCreditAmount: number;
  journalId: number;
  journalLabel: string;
  documentAccountLines: Array<DocumentAccountLine> = [];
  fiscalYearId: string;

  constructor(documentDate?: Date, codeDocument?: string, label?: string, journalId?: number, documentAccountLines?: Array<DocumentAccountLine>) {
    this.documentDate = documentDate;
    this.codeDocument = codeDocument;
    this.label = label;
    this.journalId = journalId;
    this.documentAccountLines = documentAccountLines;
  }
}
