import { LiterableDocumentAccountLine } from "./LiterableDocumentAccountLine";

export class LetteringDataSource {

  content: Array<LiterableDocumentAccountLine> = [];
  totalElementsOfAccounts: number;
  totalElementsOfDocumentAccountLinesPerAccount: number;
  totalElementsOfDocumentAccountLines: number;
  totalDebit: number;
  totalCredit: number;
}
