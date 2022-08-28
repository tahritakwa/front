import { Currency } from '../administration/currency.model';
import { DocumentLinePrices } from './document-line-prices.model';
import { Resource } from '../shared/ressource.model';
import { CommercialsCustomerContract } from '../payroll/commercials-customer-contract.model';
import { ConsultantsCustomerContract } from '../payroll/consultants-customer-contract.model';
import { FileInfo } from '../shared/objectToSend';

export class Prices extends Resource {
  LabelPrices: string;
  CodePrices: string;
  CurrentDate?: Date;
  CurrentQuantity?: number;
  IdUsedCurrency?: number;
  UnitPriceHTaxe: number;
  TotalDiscount: number;
  IdPrices: Array<number>;
  AttachmentUrl: string;
  ContractCode: string;
  Files: Array<any>;
  FilesInfos: FileInfo;
  UploadedFiles: Array<string>;
  IdCurrencyNavigation: Currency;
  DocumentLinePrices: Array<DocumentLinePrices>;
  CommercialsCustomerContract: CommercialsCustomerContract;
  ConsultantsCustomerContract: ConsultantsCustomerContract;
  ItemPrices: Array<any>;
  PriceDetail: Array<any>;
  TiersPrices: Array<any>;
  PriceQuantityDiscountList: Array<any>;
  PriceTotalPurchasesDiscountList: Array<any>;
  PriceSpecialPriceDiscountList: Array<any>;
  PriceGiftedItemsDiscountList:  Array<any>;
  ObservationsFilesInfo: Array<FileInfo>;
}
