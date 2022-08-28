
import { DocumentLine } from './document-line.model';
import { FinancialCommitment } from './financial-commitment.model';
import { StockCalculation } from '../inventory/stock-calculation.model';
import { DocumentStatus } from './document-status.model';
import { PaymentMethod } from '../payment-method/payment-method.model';
import { Tiers } from '../achat/tiers.model';
import { BankAccount } from '../shared/bank-account.model';
import { SettlementMode } from './settlement-mode.model';
import { Resource } from '../shared/ressource.model';
import { Comment } from '../shared/comment.model';
import { FileInfo } from '../shared/objectToSend';
import { DocumentExpenseLine } from '../purchase/document-expense-line.model';
import { Contact } from '../shared/contact.model';
import { Claim } from '../helpdesk/claim.model';
import { DocumentWithholdingTax } from './document-withholding-tax.model';
import { Currency } from '../administration/currency.model';
import { DocumentTaxsResume } from './document-Taxs-Resume.model';
import { SessionCash } from '../payment/session-cash.model';


export class Document extends Resource {
  Code: string;
  Reference: string;
  IdDocumentStatus: number;
  DocumentTypeCode: string;
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
  IdUsedCurrencyNavigation: Currency;
  IdCurrency: number;
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
  IsSaleDocumentType: boolean;
  IdDecisionMaker?: number;
  AskedByRequest: string;
  ApprovedByRequest: string;
  DocumentTotalExcVatTaxes?: number;
  DocumentTotalExcVatTaxesWithCurrency?: number;  /**taxe hors tva */
  IdValidator?: number;
  Files: Array<any>;
  FilesInfos: Array<FileInfo>;
  UploadedFiles: Array<string>;
  DocumentLine: Array<DocumentLine> = new Array<DocumentLine>();
  DocumentExpenseLine: Array<DocumentExpenseLine> = new Array<DocumentExpenseLine>();
  DocumentWithholdingTax: Array<DocumentWithholdingTax> = new Array<DocumentWithholdingTax>();
  FinancialCommitment: Array<FinancialCommitment>;
  StockCalculation: StockCalculation;
  DocumentTypeCodeNavigation: DocumentType;
  IdDocumentStatusNavigation: DocumentStatus;
  IdPaymentMethodNavigation: PaymentMethod;
  IdTiersNavigation: Tiers;
  IdContactNavigation: Contact;
  IdBankAccountNavigation: BankAccount;
  IdSettlementMode: number;
  IdSettlementModeNavigation: SettlementMode;
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
  IdInvoiceEcommerce?: number;

  IdExchangeRate: number;
  ExchangeRate: number;
  isAbledToMerge: boolean;
  UserMail: string;
  InoicingType: number;

  DocumentInvoicingNumber?: any;
  DocumentInvoicingDate?: Date;
  IsDeliverySuccess?: boolean;
  IsContactChanged?: boolean;
  formatOption: any ;
  ProvisionalCode: string ;
  IsAccounted: boolean;
  DocumentVarchar8: string;/** Project code */
  DocumentVarchar7: string;/**Bc code */
  DocumentVarchar2: string;/** Market number */
  DocumentVarchar3: string;/**Delivery Period */
  DocumentTaxsResume : Array<DocumentTaxsResume>;
  Priority: number;
  IsForPos?: boolean;
  IdSessionCounterSales : number;
  IdSessionCounterSalesNavigation : SessionCash;
  IdVehicle: number;
  IsSynchronizedBtoB?: boolean;
  IdSalesDepositInvoice? : number;
  IdSalesOrder? : number;
  DepositAmount? : number;
  LeftToPayAmount? : number;
  DepositInvoiceCode : string;
  InvoiceFromDepositOrderCode : string;
  DepositOrderCode : string;
  IdInvoiceFromDepositOrderCode? : number;
  InvoiceFromDepositOrderStatusCode? : number; 
  DepositOrderStatusCode? : number; 
  DepositInvoiceStatusCode? : number; 
  AssociatedDocumentsCode : string;
  constructor(line?: Array<DocumentLine>, init?: Partial<Document>, filesInfos?: Array<FileInfo>) {
    super();
    let documentLine = [];
    if (init) {
      Object.assign(this, init);
      this.IdUsedCurrency = init.IdCurrency;
    }
    Object.assign(documentLine, line);
    documentLine.forEach(element => {
      this.DocumentLine.push(element);
    });
    if (filesInfos) {
      this.FilesInfos = filesInfos;
    }


  }
}

