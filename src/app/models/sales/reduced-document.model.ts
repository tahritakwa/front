
import { StockCalculation } from '../inventory/stock-calculation.model';
import { Resource } from '../shared/ressource.model';
import { Comment } from '../shared/comment.model';
import { DocumentExpenseLine } from '../purchase/document-expense-line.model';
import { Claim } from '../helpdesk/claim.model';
import { ReducedDocumentLine } from './reduced-document-line.model';
import { ReducedContact } from '../shared/reduced-contact.model';
import { Warehouse } from '../inventory/warehouse.model';
import { isNullOrUndefined } from 'util';


export class ReducedDocument extends Resource {
  Code: string;
  Reference: string;
  IdDocumentStatus: number;
  DocumentStatus: any;
  DocumentTypeCode: string;
  DocumentType: any;
  Informations: string;
  IdTiers?: number; /**tires */
  CreationDate?: Date;
  ValidationDate?: Date;
  DocumentDate?: Date; /* Facturation date*/
  DateTerm?: Date;
  DocumentHtprice?: number;
  DocumentTotalVatTaxes?: number;
  DocumentTtcprice?: number;
  DocumentRemainingAmount?: number;
  DocumentAmountPaid?: number;
  DocumentTotalDiscount?: number;
  AmountInLetter: string;
  WithHoldingFlag?: boolean;
  IdDiscountGroupTiers?: number;
  IdPaymentMethod?: number; /**Payment */
  IdTaxeGroupTiers?: number;
  Name: string;
  IdContact?: number; /**Contact */
  MatriculeFiscale: string;
  IdUsedCurrency?: number; /**currency */
  IdCurrency: number;
  ExchangeRate?: number;
  DocumentHtpriceWithCurrency?: number; /**Montant HT */
  DocumentTotalVatTaxesWithCurrency?: number; /**TVA */
  DocumentTtcpriceWithCurrency?: number; /**Montant ttc */
  DocumentRemainingAmountWithCurrency?: number;
  DocumentAmountPaidWithCurrency?: number;
  DocumentTotalDiscountWithCurrency?: number; /*Remise */
  Adress: string;
  FirstName: string;
  LastName: string;
  Tel1: string;
  Tel2: string;
  AttachmentUrl: string;
  IdBankAccount?: number; /**Bank */
  DocumentPriceIncludeVat?: number;
  DocumentOtherTaxes?: number; /**Timbre fiscale */
  DocumentOtherTaxesWithCurrency?: number;
  IsSaleDocumentType?: number;
  IdDecisionMaker?: number;
  AskedByRequest: string;
  ApprovedByRequest: string;
  DocumentTotalExcVatTaxes?: number;
  DocumentTotalExcVatTaxesWithCurrency?: number;  /**taxe hors tva */
  IdValidator?: number;
  DocumentLine: Array<ReducedDocumentLine> = new Array<ReducedDocumentLine>();
  DocumentExpenseLine: Array<DocumentExpenseLine> = new Array<DocumentExpenseLine>();
  StockCalculation: StockCalculation;
  IdContactNavigation: ReducedContact;
  IdWarehouseNavigation: Warehouse;
  IdSettlementMode: number;
  DocumentMonthDate: number;
  Consultants: string;
  IsChecked: boolean;
  IsTermBilling: boolean;
  DocumentPriceIncludeVatWithCurrency: number;
  IdDocumentAssociated?: number;
  Comments: Array<Comment>;
  IdPriceRequest: number;
  IsGenerated: boolean;
  DocumentAssociatedType: string;
  IsSubmited: boolean;
  IsBToB: boolean;
  hasSalesInvoices?: boolean;
  ClaimIdSalesAssetDocumentNavigation: Array<Claim>;
  ClaimIdPurchaseAssetDocumentNavigation: Array<Claim>;
  ClaimIdDeliveryDocumentNavigation: Array<Claim>;
  ClaimIdDocumentNavigation: Array<Claim>;
  ClaimIdPurchaseDocumentNavigation: Array<Claim>;
  ClaimIdReceiptDocumentNavigation: Array<Claim>;
  ClaimIdSalesDocumentNavigation: Array<Claim>;
  InoicingType: number;
  IsSynchronizedBToB?: boolean;
  constructor(line?: Array<ReducedDocumentLine>, init?: Partial<ReducedDocument>) {
    super();
    let documentLine = []; 
    if (!isNullOrUndefined(document)) {
      Object.assign(this, document);
      this.DocumentType = init.DocumentTypeCode;
      this.DocumentStatus = init.IdDocumentStatus;
      this.IdUsedCurrency = init.IdCurrency;
      if (line && line.length > 0) {
        Object.assign(documentLine, line);
        // Object.assign(this.DocumentLine, lines);
        line.forEach(element => {
          // element.Taxe = new Array<Taxe>();
          this.DocumentLine.push(element);
        });
      } else {
        this.DocumentLine = new Array<ReducedDocumentLine>();
      }
    }
  }
}

