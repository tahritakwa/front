export class FiltreDocument {

  DocumentDate: Date;
  DocumentCode: string;
  TierName: string;
  AmountTTC: number;
 
  constructor(DocumentDate?: Date, DocumentCode?: string , TierName?: string, AmountTTC?: number) {
    this.DocumentDate = DocumentDate;
    this.DocumentCode = DocumentCode;
    this.TierName = TierName;
    this.AmountTTC = AmountTTC;
  }
}
